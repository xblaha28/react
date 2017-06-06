import React, { Component } from 'react';
import './App.css';
import { Button, Table, Modal, FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap'
import moment from 'moment';

class Cosmonaut {
  constructor(_id, firstName, lastName, birthDate, ability) {
    this._id = _id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.birthDate = birthDate;
    this.ability = ability;
  }
}

//polozka formulare
function FieldGroup({ id, label, help, ...props }) {
  return (
    <FormGroup controlId={id} className="field-group">
      <ControlLabel className="control-label">{label}</ControlLabel>
      <FormControl {...props} />
      {help && <HelpBlock>{help}</HelpBlock>}
    </FormGroup>
  );
}

//pridavaci modal
class AddModal extends Component{
  constructor() {
    super();
    this.saveRow = this.saveRow.bind(this);
    this.state = { 
      show: false,
      index: -1,
      firstName: "",
      lastName: "",
      date: "",
      ability: ""
    };
  }

  saveRow(){
    var date = this.state.date; //vychozi hodnota datumu je rovna zadane hodnote
    if(this.state.date.length === 0){ //pokud neni zadane datum, tak se vezme aktualni
      date = moment().format();
      date = date.slice(0,10);
    }

    var cosmonaut = new Cosmonaut("", this.state.firstName, this.state.lastName, date, this.state.ability);

    this.props.addCosmonaut(cosmonaut);

    this.setState({ 
      show: false,
      index: -1,
      _id: "",
      firstName: "",
      lastName: "",
      date: "",
      ability: ""
    });
  }

  render() {
    let close = () => this.setState({ show: false});

    return (
      <div className="modal-container" style={{height: 80}}>
        <div className="text-right plus-button">
          <Button            
            bsStyle="primary"
            onClick={() => this.setState({ show: true})}
          >
            <i className="fa fa-plus" aria-hidden="true"></i>
          </Button>
        </div>

        <Modal
          show={this.state.show}
          onHide={close}
          container={this}
          aria-labelledby="contained-modal-title"
        >
          <form>
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title">Přidání nového kosmonauta</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <FormGroup>
                <FieldGroup
                  id="formControlsFirstName"
                  label="Jméno"
                  type="text"
                  placeholder="Zadejte jméno"
                  onChange={(event) => this.setState({firstName: event.target.value})}
                />
                <FieldGroup
                  id="formControlsLastName"
                  label="Příjmení"
                  type="text"
                  placeholder="Zadejte příjmení"
                  onChange={(event) => this.setState({lastName: event.target.value})}
                />         
                <FieldGroup
                  id="formControlsDate"
                  label="Datum narození"
                  type="date"
                  onChange={(event) => this.setState({date: event.target.value})}
                />
                <FieldGroup
                  id="formControlsAbility"
                  label="Superschopnost"
                  type="text"
                  placeholder="Zadejte superschopnost"
                  onChange={(event) => this.setState({ability: event.target.value})}
                />
              </FormGroup>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={close}>Zavřít</Button>
              <Button bsStyle="primary" onClick={this.saveRow}>Uložit</Button>
            </Modal.Footer>
          </form>
        </Modal>
      </div>
    );
  }
}

//radek tabulky
class CosmonautRow extends Component{
    constructor(){
      super();
      this.renderDeleteModal = this.renderDeleteModal.bind(this);
    }

    renderDeleteModal(){
      this.props.renderDeleteModal(this.props.index, this.props.cosmonaut);
    }

    convertDate(date){
      var dateArr = date.slice(0, 10).split("-");
      return dateArr[2] + ". " + dateArr[1] + ". " + dateArr[0]
    }

    render(){
        return(
            <tr>
              <td>{this.props.cosmonaut.firstName}</td>
              <td>{this.props.cosmonaut.lastName}</td>
              <td>{this.convertDate(this.props.cosmonaut.birthDate)}</td>
              <td>{this.props.cosmonaut.ability}</td>
              <td className="text-right"><Button bsStyle="danger" onClick={this.renderDeleteModal}><i className="fa fa-trash" aria-hidden="true"></i></Button></td>
            </tr>
        );
    }
}

//mazaci modal
class DeleteModal extends Component{
  render(){
    return(
      <div className="modal-container" style={{height: 200}}>
        <Modal
          show={this.props.showDeleteModal}
          onHide={this.props.closeDeleteModal}
          container={this.props.container}
          aria-labelledby="contained-modal-title"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title">Potvrzení smazání</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Opravdu chcete smazat záznam o kosmonautovi <b className="text-primary">{this.props.cosmonaut.firstName} {this.props.cosmonaut.lastName}</b>?
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.props.closeDeleteModal}>Zrušit</Button>
            <Button bsStyle="danger" onClick={this.props.removeRow}>Smazat</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

//seznam kosmonautu
class CosmonautsList extends Component{
    constructor(){
      super();
      this.removeRow = this.removeRow.bind(this);
      this.addCosmonaut = this.addCosmonaut.bind(this);
      this.openDeleteModal = this.openDeleteModal.bind(this);
      this.state = {
        data : [
          new Cosmonaut("", "", "", "", "")
        ],
        showDeleteModal: false,
        showEditModal: false,
        rowIndex: 0,
        cosmonaut: ""
      };
    }

    componentDidMount(){
      fetch(`http://localhost:3000/cosmonauts`)
      .then(result=>result.json())
      .then(data=>this.setState({data}))
    }

    addCosmonaut(cosmonaut){
      var arr = this.state.data;
      //var json;
      let addToStateArray = () => {
        arr.push(cosmonaut);
        this.setState({data: arr});
      }

      fetch(`http://localhost:3000/cosmonauts`, {
        method: 'post',  
        headers: {  
          "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"  
        },  
        body: 'firstName='+ cosmonaut.firstName +
              '&lastName='+ cosmonaut.lastName +
              '&birthDate='+ cosmonaut.birthDate +
              '&ability='+ cosmonaut.ability
      })/*
      .then(json)*/
      .then(function (data) {
        data.json().then( json => { 
                            cosmonaut._id = json._id;  //ulozeni vraceneho identifikatoru nove vytvoreneho zaznamu
                            addToStateArray();  //pridani zaznamu o kosmonautovi do pole
                        });
      })
    }

    removeRow(i, _id){
      var arr = this.state.data;
      arr.splice(i, 1);
      this.setState({data: arr, showDeleteModal: false})

      fetch('http://localhost:3000/cosmonauts/' + _id, {
        method: 'DELETE'
      }).then(res => res)
    }

    openDeleteModal(i, cosmonaut){
      this.setState({ showDeleteModal: true, rowIndex: i, cosmonaut: cosmonaut});
    }
    
    render(){
        let closeDeleteModal = () => this.setState({ showDeleteModal: false});

        const rows = this.state.data.map((val, i) =>
          <CosmonautRow key={i} index={i} _id={val._id} renderDeleteModal={this.openDeleteModal} renderEditModal={this.openEditModal} cosmonaut={val} />
        );

        return(
          <div>
            <Table responsive>
              <thead>
                <tr>
                  <th>Jméno</th>
                  <th>Příjmení</th>
                  <th>Datum narození</th>
                  <th>Superschopnost</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                  {rows}
              </tbody>
            </Table>

            <AddModal addCosmonaut={this.addCosmonaut}/>

            <DeleteModal showDeleteModal={this.state.showDeleteModal} closeDeleteModal={closeDeleteModal} container={this} cosmonaut={this.state.cosmonaut} removeRow={() => this.removeRow(this.state.rowIndex, this.state.cosmonaut._id)}/>
            
          </div>
        );
    }
}

class App extends Component {
  render() {
    return (
      <div className="App container">
        <h1 className="text-left">Elektronická evidence kosmonautů <i className="fa fa-rocket" aria-hidden="true"></i></h1>
        <p className="text-justify">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sodales sed nisi eget blandit. Duis vel tortor id nisi bibendum gravida. Aenean venenatis mi eu pharetra iaculis. Nam at arcu massa. Integer at nulla bibendum, bibendum dui eu, feugiat tortor. Etiam scelerisque elit sit amet ultricies ornare. Aenean tempus blandit maximus. Praesent ut odio sit amet turpis pellentesque egestas vel ut risus. Curabitur ultricies diam id dapibus tincidunt. Nulla consectetur aliquet laoreet. Morbi non augue et eros consectetur imperdiet ut et justo.
        </p>
        <CosmonautsList />
      </div>
    );
  }
}

export default App;
