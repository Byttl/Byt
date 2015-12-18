package models

type Error struct {
	Error string `json:"error"`
}

func NewError(txt string) *Error {

	return &Error{
		Error: txt,
	}
}
