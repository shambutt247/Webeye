import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import axios from "axios";

export default class FormDialog extends Component{

  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);

    this.state = {
      open:false,
  infoMode:false ,
  data:{
    name1:'',
    name2:'',
    itemNumber1:'',
    itemNumber2:'',
    price1:0,
    price2:0,
    link1:'',
    link2:'',
    currentDate:null,
    img:null,
    oldStock:false,
    inStock:false,
  },
  title:'Enter Link to Add',
  pleaseWait:'',
   nameRef:null ,
   itemNumberRef:null,
   priceRef:null ,
   linkRef:null,
   currDate:null,
    };

  }

  handleClickOpen = () => {
    this.setState({
      open:true,
    })
  };

  componentDidMount() {
    const x=new Date();
    const date = x.getDate() + '-' + (x.getMonth() + 1)+'-'+ x.getFullYear();
    const v=this.state.data;
    v.currentDate=date;
    this.setState({
      data:v,
    })
  }

  retrieveInfo = async(e) =>{
    this.setState({
      pleaseWait:"Processing . . ."
    })
    let y = this.state.data;
    //get cheerio to get sams club info
    if(this.state.data.link1!==null){
      let charlie = {
          webUrl: this.state.data.link1,
        };
        await axios.post("/api/getUrl", charlie).then((res) => {
          if (res.data !== null) {
            y.name1=res.data.name;
            y.price1=res.data.priceOnSams;
            y.link1=res.data.link;
            y.itemNumber1=res.data.itemNumber;
            y.img=res.data.img;
            y.inStock=res.data.inStock;
            y.oldStock=res.data.inStock;
          }
          console.log(y);
        });
  }else {
    this.setState({
      pleaseWait:"Could not get Data from Link"
    })
    return};
    //show data on HTML dialog
    this.setState({
      title:'Enter Other Info and Details',
      infoMode:true,
      pleaseWait:'',
      date:y,
    })
  }

  handleClose = () => {
    let x={
      name1:'',
      name2:'',
      itemNumber1:'',
      itemNumber2:'',
      price1:0,
      price2:0,
      link1:'',
      link2:'',
      currentDate:null,
      img:null,
      oldStock:false,
      inStock:false,
    }
    this.setState({
      data:x,
      infoMode:false,
      open:false,
    })
  };

  onChange=(e)=>{
    let x=this.state.data;
    x[e.target.id]=e.target.value;
    this.setState({
      data:x,
    })
  }

  saveItem=()=>{
    this.props.sendData(this.state.data);
    this.clearDataObject();
  }

  saveItemAddNew = () =>{
    this.saveItem();
  }

  saveItemClose=()=>{
    this.saveItem();
    this.handleClose();
  }

  clearDataObject=()=>{
    let x={
      name1:'',
      name2:'',
      itemNumber1:'',
      itemNumber2:'',
      price1:0,
      price2:0,
      link1:'',
      link2:'',
      currentDate:null,
      img:null,
      inStock:false,
    }
    this.setState({
      data:x,
      infoMode:false,
      
    })

  }

  render(){
    return (
      <div>
        <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
          Add Item
        </Button>
        <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title" maxWidth='sm' fullWidth={true}>
          <DialogContent>
            <DialogContentText>
              {this.state.title}
              {this.state.data.img ? (
                <img className="img-style blocker" src={this.state.data.img} />
              ):(<div></div>)}
            </DialogContentText>
            {this.state.infoMode ? (
                <div>
              <div className='form-item'>
            <h4 className="w-50">{this.state.data.name1}</h4>
            <TextField
            className="w-50"
              autoFocus
              margin="dense"
              id="name2"
              value={this.state.data.name2}
              onChange={e => this.onChange(e)}
              onKeyPress={e => {if(e.key==='Enter')
              this.state.itemNumberRef.current.focus();}}
              label="New Name"
              inputRef={this.state.nameRef}
              type="text"
            />
            </div>
            <div className="form-item">
            <h4 className="w-50">Item # <h3 className="in-line">{this.state.data.itemNumber1}</h3></h4>
            <TextField
            className="w-50"
              autoFocus
              margin="dense"
              id="itemNumber2"
              label="New ITGN#"
              value={this.state.itemNumber2}
              inputRef={this.state.itemNumberRef}
              onChange={e => this.onChange(e)}
              onKeyPress={e => {if(e.key==='Enter')
              this.state.priceRef.current.focus();}}
              type="number"
            />
            </div>
            <div className="form-item">
            <h4 className="w-50">Price : <h3 className="in-line">{this.state.data.price1}</h3></h4>
            <TextField
            className="w-50"
              autoFocus
              margin="dense"
              id="price2"
              label="New Price"
              value={this.state.price2}
              inputRef={this.state.priceRef}
              onChange={e => this.onChange(e)}
              onKeyPress={e => {if(e.key==='Enter')
              this.state.linkRef.current.focus();}}
              type="number"
            />
            </div>
            <div className='form-item'>
            <h4 className="w-50">Date Upload : <h3 className="in-line">{this.state.data.currentDate}</h3></h4>
            <TextField
            className="w-50"
              autoFocus
              margin="dense"
              id="link2"
              label="New Link"
              value={this.state.link2}
              onChange={e => this.onChange(e)}
              inputRef={this.state.linkRef}
              type="text"
            />
            
            </div>
            </div>
            ):(
  <TextField
              autoFocus
              margin="dense"
              id="link1"
              value={this.state.data.link1}
              onChange={e => this.onChange(e)}
              onKeyPress={e => {if(e.key==='Enter')
              this.retrieveInfo();}}
              label="Enter Link"
              type="text"
              fullWidth
            />
            )}
            
            
            
          </DialogContent>
          <DialogActions>
              {this.state.infoMode ? (
                  <div>
  <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.saveItemClose} color="primary">
              Save
            </Button>
            <Button onClick={this.saveItemAddNew} color="primary">
              Save +
            </Button>
                  </div>
              ):(
                <div  style={{
                  display: "contents",
                  color: "red"
              }}>
<h4 className="in-line margin-all">{this.state.pleaseWait}</h4>
  <Button onClick={this.retrieveInfo} color="primary">
              Add
            </Button>
                </div>
                
              )}
            
            
          </DialogActions>
        </Dialog>
      </div>
    );
  }
  

}