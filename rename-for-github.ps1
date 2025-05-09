# PowerShell script to rename image directories and files to force Git to recognize them as new
Write-Host "Starting the renaming process for images and folders..." -ForegroundColor Cyan

# Configuration
$directorySuffix = "-repo" # Will be added to directory names
$fileSuffix = "_file"      # Will be added before file extension

# Store original to new mappings
$mappings = @{}

# Function to rename directories and their contents
function Rename-ImageDirectories {
    param (
        [string]$baseDir
    )
    
    Write-Host "`nProcessing base directory: $baseDir" -ForegroundColor Cyan
    
    # Check if the directory exists
    if (-not (Test-Path $baseDir)) {
        Write-Host "Directory not found: $baseDir" -ForegroundColor Red
        return
    }
    
    # Get all subdirectories in the images folder
    $directories = Get-ChildItem -Path $baseDir -Directory
    Write-Host "Found $($directories.Count) directories to rename"
    
    # Rename each directory
    foreach ($dir in $directories) {
        $oldPath = $dir.FullName
        $newDirName = "$($dir.Name)$directorySuffix"
        $newPath = Join-Path -Path $dir.Parent.FullName -ChildPath $newDirName
        
        Write-Host "  - Renaming directory: $($dir.Name) -> $newDirName" -ForegroundColor Yellow
        
        try {
            # Rename the directory
            Rename-Item -Path $oldPath -NewName $newDirName -Force
            
            # Store the mapping (for updating references later)
            $oldRelativePath = "$baseDir/$($dir.Name)"
            $newRelativePath = "$baseDir/$newDirName"
            $mappings[$oldRelativePath] = $newRelativePath
            
            # Now process files in the renamed directory
            $imageFiles = Get-ChildItem -Path $newPath -File -Include "*.jpg", "*.jpeg", "*.png", "*.gif", "*.svg", "*.mp4", "*.webp"
            Write-Host "    Found $($imageFiles.Count) files to rename"
            
            foreach ($file in $imageFiles) {
                $oldFileName = $file.Name
                $extension = $file.Extension
                $nameWithoutExt = $file.BaseName
                $newFileName = "$nameWithoutExt$fileSuffix$extension"
                
                Write-Host "      Renaming: $oldFileName -> $newFileName" -ForegroundColor DarkYellow
                
                try {
                    $oldFilePath = $file.FullName
                    $newFilePath = Join-Path -Path $file.DirectoryName -ChildPath $newFileName
                    
                    # Rename the file
                    Rename-Item -Path $oldFilePath -NewName $newFileName -Force
                    
                    # Store the mapping
                    $oldFileRelativePath = "$($newRelativePath)/$oldFileName"
                    $newFileRelativePath = "$($newRelativePath)/$newFileName"
                    $mappings[$oldFileRelativePath] = $newFileRelativePath
                    
                    # Also store with image/ prefix for HTML references 
                    $mappings["images/$($dir.Name)/$oldFileName"] = "images/$newDirName/$newFileName"
                    
                    # Also store the version with leading slash
                    $mappings["/images/$($dir.Name)/$oldFileName"] = "/images/$newDirName/$newFileName"
                }
                catch {
                    Write-Host "        ERROR: Failed to rename file $oldFileName" -ForegroundColor Red
                }
            }
        }
        catch {
            Write-Host "    ERROR: Failed to rename directory $($dir.Name)" -ForegroundColor Red
        }
    }
    
    # Generate a summary of all mappings for debugging
    $mappingFile = "path-mappings.txt"
    Write-Host "`nSaving path mappings to $mappingFile" -ForegroundColor Cyan
    $mappings.GetEnumerator() | ForEach-Object { "$($_.Key) -> $($_.Value)" } | Out-File -FilePath $mappingFile
}

# Function to update HTML files with new image paths
function Update-HtmlReferences {
    param (
        [string]$directory
    )
    
    Write-Host "`nUpdating HTML files in: $directory" -ForegroundColor Cyan
    
    # Find all HTML files
    $htmlFiles = Get-ChildItem -Path $directory -Filter "*.html" -Recurse
    Write-Host "Found $($htmlFiles.Count) HTML files to update"
    
    foreach ($file in $htmlFiles) {
        Write-Host "  - Processing: $($file.Name)" -ForegroundColor Yellow
        
        $content = Get-Content -Path $file.FullName -Raw
        $originalContent = $content
        $changes = 0
        
        # Replace all paths according to our mappings
        foreach ($mapping in $mappings.GetEnumerator()) {
            $oldPath = $mapping.Key
            $newPath = $mapping.Value
            
            # Create a regex that matches the path in various contexts (src, href, etc.)
            $regex = "(src|href)=""$([regex]::Escape($oldPath))"""
            
            if ($content -match $regex) {
                $content = $content -replace $regex, "`$1=""$newPath"""
                $changes++
            }
        }
        
        # Only write the file if changes were made
        if ($content -ne $originalContent) {
            Set-Content -Path $file.FullName -Value $content
            Write-Host "    - Made $changes path updates" -ForegroundColor Green
        } else {
            Write-Host "    - No changes needed" -ForegroundColor DarkGray
        }
    }
}

# Function to update Next.js component references
function Update-NextJsComponents {
    param (
        [string]$directory
    )
    
    Write-Host "`nUpdating Next.js components in: $directory" -ForegroundColor Cyan
    
    # Find all JavaScript and TypeScript files
    $jsFiles = Get-ChildItem -Path $directory -Include "*.js", "*.jsx", "*.ts", "*.tsx" -Recurse
    Write-Host "Found $($jsFiles.Count) JS/TS files to check"
    
    foreach ($file in $jsFiles) {
        $content = Get-Content -Path $file.FullName -Raw
        $originalContent = $content
        $changes = 0
        
        # Replace all paths according to our mappings
        foreach ($mapping in $mappings.GetEnumerator()) {
            $oldPath = $mapping.Key
            $newPath = $mapping.Value
            
            # For JS/TS files, we need to handle various string formats
            $singleQuoteRegex = "'$([regex]::Escape($oldPath))'"
            $doubleQuoteRegex = """$([regex]::Escape($oldPath))"""
            
            if ($content -match $singleQuoteRegex) {
                $content = $content -replace $singleQuoteRegex, "'$newPath'"
                $changes++
            }
            
            if ($content -match $doubleQuoteRegex) {
                $content = $content -replace $doubleQuoteRegex, """$newPath"""
                $changes++
            }
        }
        
        # Only write the file if changes were made
        if ($content -ne $originalContent) {
            Set-Content -Path $file.FullName -Value $content
            Write-Host "  - Updated: $($file.Name) with $changes changes" -ForegroundColor Yellow
        }
    }
}

# Main execution
# Step 1: Rename directories and files in both public and docs
Rename-ImageDirectories -baseDir "public/images"
Rename-ImageDirectories -baseDir "docs/images"

# Step 2: Update HTML references
Update-HtmlReferences -directory "docs"

# Step 3: Update Next.js component references
Update-NextJsComponents -directory "src"

Write-Host "`nRenaming process complete. Remember to commit these changes to ensure they're recognized by GitHub." -ForegroundColor Cyan
Write-Host "Run 'git add .' and 'git commit -m \"Renamed image folders and files to force update\"' to save changes." -ForegroundColor Green 