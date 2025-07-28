#!/bin/bash
# Interactive Image Restoration Tool for Manic Agency
# Restores original images from backups

echo "🔄 Image Restoration Tool"
echo "========================"
echo ""

# Check if backups exist
if [ ! -d "public/_originals" ] && [ ! -d "../../image-backups" ]; then
    echo "❌ No backup directories found!"
    echo ""
    echo "Backup locations checked:"
    echo "  - public/_originals (not found)"
    echo "  - ../../image-backups (not found)"
    echo ""
    echo "The image optimizer creates backups before modifying files."
    echo "If you haven't run the optimizer, your images are unchanged."
    exit 1
fi

echo "📁 Found backup locations:"
[ -d "public/_originals" ] && echo "   ✓ public/_originals (local backup)"
[ -d "../../image-backups" ] && echo "   ✓ ../../image-backups (external backup)"
echo ""

# Count files in backups
if [ -d "public/_originals" ]; then
    LOCAL_COUNT=$(find public/_originals -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.gif" -o -name "*.webp" -o -name "*.svg" \) | wc -l)
    echo "   Local backup contains: $LOCAL_COUNT images"
fi

if [ -d "../../image-backups" ]; then
    EXTERNAL_COUNT=$(find ../../image-backups -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.gif" -o -name "*.webp" -o -name "*.svg" \) | wc -l)
    echo "   External backup contains: $EXTERNAL_COUNT images"
fi
echo ""

echo "Choose restoration option:"
echo "[1] Restore ALL images from local backup (public/_originals)"
echo "[2] Restore ALL images from external backup (../../image-backups)"
echo "[3] Restore specific directory"
echo "[4] Restore individual files"
echo "[5] Compare current vs backup"
echo "[6] Show recently modified images"
echo "[7] Cancel"
echo ""

read -p "Selection (1-7): " choice

case $choice in
    1)
        if [ ! -d "public/_originals" ]; then
            echo "❌ Local backup directory not found!"
            exit 1
        fi
        
        echo ""
        echo "⚠️  WARNING: This will restore ALL images from local backup."
        echo "   Any optimizations will be lost."
        echo ""
        read -p "Continue? (y/N): " confirm
        
        if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
            echo ""
            echo "🔄 Restoring images..."
            cp -rv public/_originals/* public/ 2>/dev/null | grep -c "^" | while read count; do
                echo -ne "\r   Restored: $count files"
            done
            echo ""
            echo "✅ All images restored from local backup!"
            echo ""
            echo "💡 To re-optimize with better settings, run:"
            echo "   npm run optimize:images:preview  # Preview changes first"
            echo "   npm run optimize:images          # Interactive optimization"
        else
            echo "❌ Restoration cancelled."
        fi
        ;;
        
    2)
        if [ ! -d "../../image-backups" ]; then
            echo "❌ External backup directory not found!"
            exit 1
        fi
        
        echo ""
        echo "⚠️  WARNING: This will restore ALL images from external backup."
        echo "   Any optimizations will be lost."
        echo ""
        read -p "Continue? (y/N): " confirm
        
        if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
            echo ""
            echo "🔄 Restoring images..."
            cp -rv ../../image-backups/* public/ 2>/dev/null | grep -v "_originals" | grep -c "^" | while read count; do
                echo -ne "\r   Restored: $count files"
            done
            echo ""
            echo "✅ All images restored from external backup!"
        else
            echo "❌ Restoration cancelled."
        fi
        ;;
        
    3)
        echo ""
        echo "Enter directory path to restore (e.g., assets/blog/thinkpieces):"
        read -p "> " dir_path
        
        if [ -z "$dir_path" ]; then
            echo "❌ No directory specified!"
            exit 1
        fi
        
        restored=false
        
        if [ -d "public/_originals/$dir_path" ]; then
            echo ""
            echo "📁 Found in local backup: public/_originals/$dir_path"
            read -p "Restore from local backup? (y/N): " confirm
            
            if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
                mkdir -p "public/$dir_path"
                cp -rv "public/_originals/$dir_path"/* "public/$dir_path/" 2>/dev/null
                echo "✅ Directory restored from local backup: $dir_path"
                restored=true
            fi
        fi
        
        if [ "$restored" = false ] && [ -d "../../image-backups/$dir_path" ]; then
            echo ""
            echo "📁 Found in external backup: ../../image-backups/$dir_path"
            read -p "Restore from external backup? (y/N): " confirm
            
            if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
                mkdir -p "public/$dir_path"
                cp -rv "../../image-backups/$dir_path"/* "public/$dir_path/" 2>/dev/null
                echo "✅ Directory restored from external backup: $dir_path"
                restored=true
            fi
        fi
        
        if [ "$restored" = false ]; then
            echo "❌ Directory not found in any backup location!"
        fi
        ;;
        
    4)
        echo ""
        echo "Enter file path to restore (e.g., assets/blog/image.png):"
        read -p "> " file_path
        
        if [ -z "$file_path" ]; then
            echo "❌ No file specified!"
            exit 1
        fi
        
        restored=false
        
        if [ -f "public/_originals/$file_path" ]; then
            echo ""
            echo "📄 Found in local backup"
            echo "   Size: $(du -h "public/_originals/$file_path" | cut -f1)"
            read -p "Restore this file? (y/N): " confirm
            
            if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
                mkdir -p "$(dirname "public/$file_path")"
                cp -v "public/_originals/$file_path" "public/$file_path"
                echo "✅ File restored from local backup"
                restored=true
            fi
        fi
        
        if [ "$restored" = false ] && [ -f "../../image-backups/$file_path" ]; then
            echo ""
            echo "📄 Found in external backup"
            echo "   Size: $(du -h "../../image-backups/$file_path" | cut -f1)"
            read -p "Restore this file? (y/N): " confirm
            
            if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
                mkdir -p "$(dirname "public/$file_path")"
                cp -v "../../image-backups/$file_path" "public/$file_path"
                echo "✅ File restored from external backup"
                restored=true
            fi
        fi
        
        if [ "$restored" = false ]; then
            echo "❌ File not found in any backup location!"
        fi
        ;;
        
    5)
        echo ""
        echo "📊 Comparing current images with backups..."
        echo ""
        
        # Find all current images
        current_images=$(find public -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.gif" -o -name "*.webp" -o -name "*.svg" \) -not -path "*/\_originals/*" | sort)
        
        echo "Current images that differ from backup:"
        echo "--------------------------------------"
        
        count=0
        for img in $current_images; do
            rel_path=${img#public/}
            backup_path="public/_originals/$rel_path"
            
            if [ -f "$backup_path" ]; then
                current_size=$(stat -f%z "$img" 2>/dev/null || stat -c%s "$img" 2>/dev/null)
                backup_size=$(stat -f%z "$backup_path" 2>/dev/null || stat -c%s "$backup_path" 2>/dev/null)
                
                if [ "$current_size" != "$backup_size" ]; then
                    current_kb=$((current_size / 1024))
                    backup_kb=$((backup_size / 1024))
                    reduction=$(( (backup_kb - current_kb) * 100 / backup_kb ))
                    
                    echo "$rel_path"
                    echo "   Original: ${backup_kb}KB → Current: ${current_kb}KB (${reduction}% smaller)"
                    count=$((count + 1))
                    
                    if [ $count -ge 20 ]; then
                        echo ""
                        echo "... and more (showing first 20)"
                        break
                    fi
                fi
            fi
        done
        
        if [ $count -eq 0 ]; then
            echo "No differences found - images match backups"
        fi
        ;;
        
    6)
        echo ""
        echo "📊 Recently modified images (last 24 hours):"
        echo "-------------------------------------------"
        
        # Find images modified in last 24 hours
        find public -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.gif" -o -name "*.webp" -o -name "*.svg" \) -not -path "*/\_originals/*" -mtime -1 | while read file; do
            size=$(du -h "$file" | cut -f1)
            mod_time=$(date -r "$file" "+%Y-%m-%d %H:%M" 2>/dev/null || stat -c "%y" "$file" 2>/dev/null | cut -d' ' -f1,2)
            echo "${file#public/} - $size - Modified: $mod_time"
        done | sort -k4 -r | head -20
        
        echo ""
        echo "💡 These files were likely processed by the optimizer"
        ;;
        
    7)
        echo "❌ Cancelled."
        exit 0
        ;;
        
    *)
        echo "❌ Invalid selection"
        exit 1
        ;;
esac

echo ""
echo "📋 Quick commands for future use:"
echo "   npm run restore:images           # Restore all from local"
echo "   npm run restore:images:external  # Restore all from external"
echo "   npm run restore:images:interactive # This menu"
echo ""