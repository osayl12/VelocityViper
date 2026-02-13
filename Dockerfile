FROM nginx:alpine

# מוחקים את ברירת המחדל
RUN rm -rf /usr/share/nginx/html/*

# מעתיקים את כל תיקיית site
COPY site/ /usr/share/nginx/html/

# יוצרים index.html שמפנה ל-menu
RUN echo '<meta http-equiv="refresh" content="0; url=/menugame/menu.html">' > /usr/share/nginx/html/index.html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
