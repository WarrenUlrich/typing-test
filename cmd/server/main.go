package main

import (
	"embed"
	"html/template"
	"io/fs"
	"log/slog"
	"net/http"
	"os"
	"strings"
)

//go:embed web/*
var embeddedFiles embed.FS

//go:generate tsc --project ./web
func main() {
	templateFS, err := fs.Sub(embeddedFiles, "web/templates")
	if err != nil {
		slog.Error("Error creating sub filesystem for templates", err)
		os.Exit(1)
	}

	templates, err := template.ParseFS(templateFS, "*")
	if err != nil {
		slog.Error("Error parsing templates", err)
		os.Exit(1)
	}

	staticFS, err := fs.Sub(embeddedFiles, "web/static")
	if err != nil {
		slog.Error("Error creating sub filesystem for static files", err)
		os.Exit(1)
	}

	fileServer := http.FileServer(http.FS(staticFS))
	http.Handle("/static/", http.StripPrefix("/static/", fileServer))

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		templates.ExecuteTemplate(w, "home.html", nil)
	})

	slog.Info("Starting server on :8080")
	err = http.ListenAndServe(":8080", nil)
	if err != nil {
		slog.Error("Error starting server", err)
		os.Exit(1)
	}
}

func mimeFileServer(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if strings.HasSuffix(r.URL.Path, ".js") {
			// Set the Content-Type header for JavaScript files
			w.Header().Set("Content-Type", "application/javascript")
		}
		h.ServeHTTP(w, r)
	})
}
