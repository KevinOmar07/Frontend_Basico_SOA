import React from 'react';

class App extends React.Component {

  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
      address: '',
      id: '',
      tasks: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.addTask = this.addTask.bind(this);
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  }

  addTask(e) {
    e.preventDefault();
    if (this.state.id) {
      fetch(`http://localhost:4000/customer/update/${this.state.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: this.state.name,
          email: this.state.email,
          address: this.state.address,
        }),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
        .then(res => res.json())
        .then(data => {
          window.M.toast({ html: 'Task Updated' });
          this.setState({ id: '', name: '', email: '', address: '' });
          this.fetchTasks();
        });
    } else {
      fetch('http://localhost:4000/customer/create', {
        method: 'POST',
        body: JSON.stringify(this.state),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
        .then(res => res.json())
        .then(data => {
          console.log(data);
          window.M.toast({ html: 'Task Saved' });
          this.setState({ id: '', name: '', email: '', address: '' });
          this.fetchTasks();
        })
        .catch(err => console.error(err));
    }

  }

  deleteTask(id) {
    if (confirm('Are you sure you want to delete it?')) {
      fetch(`http://localhost:4000/customer/delete`, {
        method: 'DELETE',
        body: JSON.stringify({
          name: this.state.name,
          email: this.state.email,
          address: this.state.address,
          id: id
        }),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
        .then(res => res.json())
        .then(data => {
          console.log(data);
          M.toast({ html: 'Task deleted' });
          this.fetchTasks();
        });
    }
  }

  editTask(id) {
    fetch(`http://localhost:4000/customer/get/${id}`)
      .then(res => res.json())
      .then(data => {
        console.log(data[0]);
        this.setState({
          name: data[0].name,
          email: data[0].email,
          address: data[0].address,
          id: data[0].id
        });
      });
  }

  componentDidMount() {
    this.fetchTasks();
  }

  fetchTasks() {
    fetch('http://localhost:4000/customer/getAll')
      .then(res => res.json())
      .then(data => {
        this.setState({ tasks: data });
        console.log(this.state.tasks);
      });
  }

  render() {
    return (
      <div>
        {/* NAVIGATION */}
        <nav className="light-blue darken-4">
          <div className="container">
            <div className="nav-wrapper">
              <a href="#" className="brand-logo">MERN Stack</a>
            </div>
          </div>
        </nav>

        <div className="container">
          <div className="row">
            <div className="col s5">
              <div className="card">
                <div className="card-content">
                  <form onSubmit={this.addTask}>
                    <div className="row">
                      <div className="input-field col s12">
                        <input name="name" onChange={this.handleChange} value={this.state.name} type="text" placeholder="Name" autoFocus />
                      </div>
                    </div>
                    <div className="row">
                      <div className="input-field col s12">
                        <input name="email" onChange={this.handleChange} value={this.state.email} type="text" placeholder="Email" autoFocus />
                      </div>
                    </div>
                    <div className="row">
                      <div className="input-field col s12">
                        <textarea name="address" onChange={this.handleChange} value={this.state.address} cols="30" rows="10" placeholder="Address" className="materialize-textarea"></textarea>
                      </div>
                    </div>

                    <button type="submit" className="btn light-blue darken-4">
                      Enviar
                    </button>
                  </form>
                </div>
              </div>
            </div>
            <div className="col s7">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Address</th>
                  </tr>
                </thead>

                <tbody>
                  { 
                    this.state.tasks.map(task => {
                      return (
                        <tr key={task.id}>
                          <td>{task.name}</td>
                          <td>{task.email}</td>
                          <td>{task.address}</td>
                          <td>
                            <button onClick={() => this.deleteTask(task.id)} className="btn light-blue darken-4">
                              <i className="material-icons">delete</i> 
                            </button>
                            <button onClick={() => this.editTask(task.id)} className="btn light-blue darken-4" style={{margin: '4px'}}>
                              <i className="material-icons">edit</i>
                            </button>
                          </td>
                        </tr>
                      )
                    })
                  }
                </tbody>

              </table>
            </div>
          </div>
        </div>

      </div>
    )
  }
}

export default App;