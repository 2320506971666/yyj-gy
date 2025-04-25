#!/bin/bash

# 设置要处理的文件列表
HTML_FILES="index.html gallery.html film.html north.html lexue_picture.html pictures.html sanya.html tibet.html about.html model.html blender-gallery.html work.html videos.html"

# 替换 Google Fonts 和 CDN 链接的函数
update_html_file() {
  local file="$1"
  echo "处理文件: $file"
  
  # 创建临时文件
  tempfile="${file}.tmp"
  
  # 查找 Google Fonts 的 preconnect 和链接行
  start_line=$(grep -n '<link rel="preconnect" href="https://fonts.googleapis.com">' "$file" | cut -d: -f1)
  
  if [ -z "$start_line" ]; then
    echo "警告: 在 $file 中没有找到 Google Fonts 链接"
    return
  fi
  
  # 找到最后一个 Google Fonts 链接行
  last_google_line=$(grep -n 'fonts.googleapis.com.*rel="stylesheet"' "$file" | tail -1 | cut -d: -f1)
  
  if [ -z "$last_google_line" ]; then
    echo "警告: 在 $file 中没有找到 Google Fonts 样式表链接"
    return
  fi
  
  # 将原始文件的前半部分复制到临时文件
  head -n $((start_line - 1)) "$file" > "$tempfile"
  
  # 添加我们的本地字体 CSS 引用
  echo '    <!-- 本地字体替代 Google Fonts -->' >> "$tempfile"
  echo '    <link rel="stylesheet" href="./fonts/fonts.css">' >> "$tempfile"
  
  # 将原始文件从 Google Fonts 链接结束后的部分复制到临时文件
  tail -n +$((last_google_line + 1)) "$file" | sed 's|https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css|https://cdn.bootcdn.net/ajax/libs/font-awesome/6.4.0/css/all.min.css|g' >> "$tempfile"
  
  # 用临时文件替换原始文件
  mv "$tempfile" "$file"
  echo "✅ 已更新: $file"
}

echo "开始更新所有HTML文件..."

# 处理每个HTML文件
for file in $HTML_FILES; do
  if [ -f "$file" ]; then
    update_html_file "$file"
  else
    echo "警告: 文件 $file 不存在"
  fi
done

echo "所有HTML文件更新完成！" 