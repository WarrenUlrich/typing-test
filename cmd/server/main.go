package main

import (
	"embed"
	"html/template"
	"io/fs"
	"log"
	"net/http"
	"os"
)

//go:embed web/templates/*
//go:embed web/static/*
var embeddedFiles embed.FS

func main() {
	templateFS, err := fs.Sub(embeddedFiles, "web/templates")
	if err != nil {
		log.Printf("Error creating sub filesystem for templates: %v", err)
		os.Exit(1)
	}

	templates, err := template.ParseFS(templateFS, "*")
	if err != nil {
		log.Printf("Error parsing templates: %v", err)
		os.Exit(1)
	}

	staticFS, err := fs.Sub(embeddedFiles, "web/static")
	if err != nil {
		log.Printf("Error creating sub filesystem for static files: %v", err)
		os.Exit(1)
	}

	fileServer := http.FileServer(http.FS(staticFS))
	http.Handle("/static/", http.StripPrefix("/static/", fileServer))

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		templates.ExecuteTemplate(w, "home.html", nil)
	})

	http.HandleFunc("/data", func(w http.ResponseWriter, r *http.Request) {
		http.Redirect(w, r, "/static/data/data.json", http.StatusFound)
	})

	log.Println("Starting server on :8080")
	err = http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Printf("Error starting server: %v", err)
		os.Exit(1)
	}
}
