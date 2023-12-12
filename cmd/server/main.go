package main

import (
	"embed"
	"encoding/json"
	"html/template"
	"io"
	"io/fs"
	"log"
	"net/http"
	"os"
)

//go:embed data
//go:embed web/templates/*
//go:embed web/static/*
var embeddedFS embed.FS

func main() {
	templateFS, err := fs.Sub(embeddedFS, "web/templates")
	if err != nil {
		log.Printf("Error creating sub filesystem for templates: %v", err)
		os.Exit(1)
	}

	staticFS, err := fs.Sub(embeddedFS, "web/static")
	if err != nil {
		log.Printf("Error creating sub filesystem for static files: %v", err)
		os.Exit(1)
	}

	dataFS, err := fs.Sub(embeddedFS, "data")
	if err != nil {
		log.Printf("Error creating sub filesystem for data files: %v", err)
		os.Exit(1)
	}

	fileServer := http.FileServer(http.FS(staticFS))
	http.Handle("/static/", http.StripPrefix("/static/", fileServer))

	templates, err := template.ParseFS(templateFS, "*")
	if err != nil {
		log.Printf("Error parsing templates: %v", err)
		os.Exit(1)
	}

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		templates.ExecuteTemplate(w, "index.html", nil)
	})

	http.HandleFunc("/words", func(w http.ResponseWriter, r *http.Request) {
		wordFile, err := dataFS.Open("words.json")
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer wordFile.Close()

		wordBytes, err := io.ReadAll(wordFile)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		var words []string
		err = json.Unmarshal(wordBytes, &words)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		jsonData, err := json.Marshal(words)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.Write(jsonData)
	})

	log.Println("Starting server on :8080")
	err = http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Printf("Error starting server: %v", err)
		os.Exit(1)
	}
}
