package database

import (
	"encoding/json"
	"errors"
	"fmt"
	"math/rand"
	"os"
	"sync"
)

type JsonDB struct {
	path  string
	state *state
}

type state struct {
	sync.Mutex
	Users map[int64]*User `json:"users"`
}

func NewJsonDatabase(path string) (*JsonDB, error) {
	db := &JsonDB{
		path: path,
		state: &state{
			Users: make(map[int64]*User, 0),
		},
	}
	err := db.load(path)
	return db, err
}

func (j *JsonDB) Close() error {
	return j.save()
}

func (j *JsonDB) load(path string) error {
	if _, err := os.Stat(path); err != nil {
		// file does not exist, so use default
		fmt.Println("no data file found, using default")
		return nil
	}

	fmt.Println("data file found")
	d, err := os.ReadFile(path)
	if err != nil {
		return err
	}

	s := &state{}
	err = json.Unmarshal(d, &s)
	if err != nil {
		return err
	}

	j.state = s
	return nil
}

func (j *JsonDB) save() error {
	d, err := json.Marshal(j.state)
	if err != nil {
		return err
	}

	f, err := os.OpenFile(j.path, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, 0644)
	if err != nil {
		return err
	}
	defer f.Close()
	_, err = f.Write(d)
	return err
}

func (j *JsonDB) CreateUser(u *User) (*User, error) {
	j.state.Lock()
	defer j.state.Unlock()
	if _, ok := j.state.Users[u.ID]; ok {
		return nil, errors.New("key already exists")
	}
	u.ID = rand.Int63()
	j.state.Users[u.ID] = u
	return u, nil
}

func (j *JsonDB) GetUserByID(uid int64) (*User, error) {
	j.state.Lock()
	defer j.state.Unlock()
	if v, ok := j.state.Users[uid]; ok {
		return v, nil
	}
	return nil, errors.New("key does not exist")
}

func (j *JsonDB) GetUserByUsername(username string) (*User, error) {
	j.state.Lock()
	defer j.state.Unlock()
	for _, u := range j.state.Users {
		if u.Username == username {
			return u, nil
		}
	}
	return nil, errors.New("key does not exist")
}

func (j *JsonDB) UpdateUser(uid int64, u *User) (*User, error) {
	j.state.Lock()
	defer j.state.Unlock()
	if _, ok := j.state.Users[uid]; !ok {
		return nil, errors.New("key does not exist")
	}
	j.state.Users[uid] = u
	return u, nil
}
