package database

type DB interface {
	Close() error

	CreateUser(u *User) (*User, error)
	GetUserByID(uid int64) (*User, error)
	GetUserByUsername(username string) (*User, error)
	UpdateUser(uid int64, u *User) (*User, error)
}
