package recipes

type Ingredient struct {
	Name string `json:"name"`
}

type Recipe struct {
	Name        string       `json:"name"`
	Ingredients []Ingredient `json:"ingredients"`
}
