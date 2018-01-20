const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todos');

const todos = [{
  _id: new ObjectID(),
  text: 'First test todo'
}, {
  _id: new ObjectID(),
  text: 'Second test todo'
}];

beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
});

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
  it('should update todos {title,completed,completedAt}', (done) => {
// change title: "Updated", completed: true, completedAt: !null
    var id = todos[0]._id.toHexString();
    var todo = {
      text: "Updated",
      completed: true
    }

    request(app)
    .patch(`/todos/${id}`)
    .send(todo)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.completedAt).not.toBe(null);
      expect(res.body.todo.completed).toBe(todo.completed);
      expect(res.body.todo.title).toBe(todo.title);
    })
    .end((err, res) => {
      if (err) {
        return done(err);
      }
      todo = {
        completed: false
      }
// flip completed back to false trigger completedAt: null, title unchanged
      request(app)
      .patch(`/todos/${id}`)
      .send(todo)
      .expect((res) => {
        expect(res.body.todo.completed).toBe(todo.completed);
        expect(res.body.todo.completedAt).toBe(null);
        expect(res.body.todo.title).toBe(todo.title);
      }).then(() => {
        todo = {
          completed: true
        }
  // flip completed back to true trigger completedAt: back !null, title unchanged
        request(app)
        .patch(`/todos/${id}`)
        .send(todo)
        .expect((res) => {
          expect(res.body.todo.completed).toBe(todo.completed);
          expect(res.body.todo.completedAt).not.toBe(null);
        }).then(() => done()).catch((e) => done(e));
      });
    });
  });

  it('should update todos {title}', (done) => {

// change only title text everything remains the same
    var id = todos[0]._id.toHexString();
    var todo = {
      text: "Changed todo title",
    }

    request(app)
    .patch(`/todos/${id}`)
    .send(todo)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.completedAt).toBe(null);
      expect(res.body.todo.title).toBe(todo.title);
      expect(res.body.todo.completed).toBe(false);
    })
    .end(done);
  })
  it('should respond with 404 status', (done) => {

    var id = '123';
    var todo = {
      text: "Changed todo title",
    }

    request(app)
    .patch(`/todos/${id}`)
    .send(todo)
    .expect(404)
    .end(done);
  })
  it('should respond with 404 status', (done) => {

    var id = '5a628b744256c76c0d6ad509';
    var todo = {
      text: "Changed todo title",
    }

    request(app)
    .patch(`/todos/${id}`)
    .send(todo)
    .expect(404)
    .end(done);
  })
});
