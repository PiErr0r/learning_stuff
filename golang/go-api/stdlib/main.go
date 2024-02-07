package main

import (
	"encoding/json"
	"fmt"
	"go-api/recipes"
	"net/http"
	"regexp"
)

type homeHandler struct{}

func (h *homeHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Hello world\n"))
}

type recipesStore interface {
	Add(name string, recipe recipes.Recipe) error
	Get(name string) (recipes.Recipe, error)
	Update(name string, recipe recipes.Recipe) error
	List() (map[string]recipes.Recipe, error)
	Remove(name string) error
}

type RecipesHandler struct {
	store recipesStore
}

func NewRecipesHandler(s recipesStore) *RecipesHandler {
	return &RecipesHandler{store: s}
}

var (
	RecipeRe = regexp.MustCompile(`^/recipes/*$`)
	//	RecipeReWithId = regexp.MustCompile(`^/recipes/[a-z0-9]+(?:-[a-z0-9]+)+$`)
	RecipeReWithId = regexp.MustCompile(`^/recipes/([a-z0-9]+)$`)
)

func (h *RecipesHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("recipes\n"))
	fmt.Println(r.Method, RecipeReWithId.MatchString(r.URL.Path), r.URL.Path)
	switch {
	case r.Method == http.MethodPost && RecipeRe.MatchString(r.URL.Path):
		h.CreateRecipe(w, r)
	case r.Method == http.MethodGet && RecipeRe.MatchString(r.URL.Path):
		h.ListRecipes(w, r)
	case r.Method == http.MethodGet && RecipeReWithId.MatchString(r.URL.Path):
		h.GetRecipe(w, r)
	case r.Method == http.MethodPut && RecipeReWithId.MatchString(r.URL.Path):
		h.UpdateRecipe(w, r)
	case r.Method == http.MethodDelete && RecipeReWithId.MatchString(r.URL.Path):
		h.DeleteRecipe(w, r)
	default:
		w.Write([]byte("Bad request\n"))
	}
}

func (h *RecipesHandler) CreateRecipe(w http.ResponseWriter, r *http.Request) {
	var recipe recipes.Recipe

	if err := json.NewDecoder(r.Body).Decode(&recipe); err != nil {
		InternalServerErrorHandler(w, r)
		return
	}

	resID := recipe.Name
	if err := h.store.Add(resID, recipe); err != nil {
		InternalServerErrorHandler(w, r)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (h *RecipesHandler) ListRecipes(w http.ResponseWriter, r *http.Request) {
	res, err := h.store.List()

	jsonBytes, err := json.Marshal(res)

	if err != nil {
		InternalServerErrorHandler(w, r)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(jsonBytes)
}

func (h *RecipesHandler) GetRecipe(w http.ResponseWriter, r *http.Request) {
	matches := RecipeReWithId.FindStringSubmatch(r.URL.Path)

	if len(matches) < 2 {
		InternalServerErrorHandler(w, r)
		return
	}

	recipe, err := h.store.Get(matches[1])
	if err != nil {
		if err == recipes.NotFoundErr {
			NotFoundErrorHandler(w, r)
			return
		}
		InternalServerErrorHandler(w, r)
		return
	}

	jsonBytes, err := json.Marshal(recipe)
	if err != nil {
		InternalServerErrorHandler(w, r)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(jsonBytes)
}

func (h *RecipesHandler) UpdateRecipe(w http.ResponseWriter, r *http.Request) {
	matches := RecipeReWithId.FindStringSubmatch(r.URL.Path)

	if len(matches) < 2 {
		InternalServerErrorHandler(w, r)
		return
	}

	var recipe recipes.Recipe

	if err := json.NewDecoder(r.Body).Decode(&recipe); err != nil {
		InternalServerErrorHandler(w, r)
		return
	}

	err := h.store.Update(matches[1], recipe)
	if err != nil {
		InternalServerErrorHandler(w, r)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (h *RecipesHandler) DeleteRecipe(w http.ResponseWriter, r *http.Request) {
	matches := RecipeReWithId.FindStringSubmatch(r.URL.Path)

	if len(matches) < 2 {
		InternalServerErrorHandler(w, r)
		return
	}

	if err := h.store.Remove(matches[1]); err != nil {
		InternalServerErrorHandler(w, r)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func InternalServerErrorHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusInternalServerError)
	w.Write([]byte("Internal server error 500"))
}
func NotFoundErrorHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusNotFound)
	w.Write([]byte("Not found 404"))
}

func main() {
	mux := http.NewServeMux()
	store := recipes.NewMemStore()
	recipesHandler := NewRecipesHandler(store)

	mux.Handle("/", &homeHandler{})
	mux.Handle("/recipes", recipesHandler)
	mux.Handle("/recipes/", recipesHandler)

	http.ListenAndServe(":8000", mux)
}
