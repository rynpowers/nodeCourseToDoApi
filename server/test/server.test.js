const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {User} = require('./../models/user');
const {Todo} = require('./../models/todos');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo test';

    request(app)
    .post('/todos')
    .send({text})
    .expect(200)
    .expect((res) => {
      expect(res.body.text).toBe(text);
    })
    .end((err, res) => {
      if (err) {
        return done(err);
      }

      Todo.find({text}).then((todos) => {
        expect(todos.length).toBe(1);
        expect(todos[0].text).toBe(text);
        done();
      }).catch((err) => done(err));
    });
  });

  it('should not create todo with invalid body data', (done) => {
    var text = ""

    request(app)
    .post('/todos')
    .send({text})
    .expect(400)
    .end((err, res) => {
      if (err) {
        return done(err);
      }

      Todo.find().then((todos) => {
        expect(todos.length).toBe(2);
        done();
      }).catch((err) => done(err))
    });
  });
});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
    .get('/todos')
    .expect(200)
    .expect((res) => {
      expect(res.body.todos.length).toBe(2);
    })
    .end(done);

    Todo.find().then((todos) => {
        expect(todos.length).toBe(2)
      }).catch((err) => done(err))
    });
  });

  describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
      request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.todo.text).toBe(todos[0].text)
        })
        .end(done);
    });

    it('should return a 404 not found', (done) => {
      request(app)
        .get(`/todos/${new ObjectID().toHexString()}`)
        .expect(404)
        .end(done);
    });

    it('should return a 404 not found', (done) => {
      request(app)
      .get(`/todos/123`)
      .expect(404)
      .end(done);
    });
  });

describe('DELETE /todos/:id', () => {
  it('should delete a todo from the database', (done) => {

    var id = todos[0]._id.toHexString();

    request(app)
    .delete(`/todos/${id}`)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo._id).toBe(id);
    })
    .end((err, res) => {
      if (err) {
        return done(err);
      }

      Todo.findById(id).then((todo) => {
        expect(todo).toBe(null);
        done();
      }).catch((e) => done(e))
    });
  });

  it('should produce a 404 not found status', (done) => {
    request(app)
    .delete('/todos/123')
    .expect(404)
    .end(done)
  })
  it('should produce 404 not found status', (done) => {
    request(app)
    .delete('/todos/5a626d9c9d2a6b6aba947feb')
    .expect(404)
    .end(done)
  })
});

describe('PATCH /todos/:id', () => {
  it('should update text, completed and completedAT', (done) => {

    var id = todos[0]._id.toHexString();

    request(app)
      .patch(`/todos/${id}`)
      .send({
        text: "Updated",
        completed: true
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).not.toBe('number');
        expect(res.body.todo.text).toBe("Updated");
      })
      .end(done);
  });
  it('should update completed to false and reset completedAt to null', (done) => {

    var id = todos[1]._id.toHexString();

    request(app)
    .patch(`/todos/${id}`)
    .send({
      completed: false
    })
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.completed).toBe(false);
      expect(res.body.todo.completedAt).toBe(null);
    })
    .end(done)
  })

  it('should respond with 404 status', (done) => {

    var id = '123'

    request(app)
    .patch(`/todos/${id}`)
    .send({
      text: 'New text'
    })
    .expect(404)
    .end(done)
  });

  it('should respond with 404 status', (done) => {

    var id = '5a628b744256c76c0d6ad509'

    request(app)
    .patch(`/todos/${id}`)
    .send({
      text: 'New text'
    })
    .expect(404)
    .end(done)
  })
});

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  })

  it('should respond with 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done)
  })
})

describe('POST /users', () => {
  it('should create a user', (done) => {

    var email = 'example@example.com'
    var password = 'password'

    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.header['x-auth']).not.toBe(null);
        expect(res.body._id).not.toBe(null);
        expect(res.body.email).toBe(email);
      })
    .end((err, res) => {
      if (err) {
        return done()
      }else {
        User.findOne({email}).then((user) => {
          expect(user).not.toBe(null)
          expect(user.password).not.toBe(password);
          done()
        })
      }
    })
  })
  it('should return validation errors if request invalid', (done) => {

    var email = 'ryaample.com'
    var password = 'password'

    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
    .end((err, res) => {
      if (err) {
        return done(err)
      }else {

      var email = 'ryan@example.com'
      var password = 'pass'

      request(app)
        .post('/users')
        .send({email, password})
        .expect(400).then(() => done()).catch((e) => done(e))
      }
    })

  })
  it('should not create a user if email in use', (done) => {

    var email = users[0].email
    var password = 'password'

    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
    .end(done)
  })
})
