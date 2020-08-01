import React, { Component } from "react";
import fire from "../fire";
import axios from "axios";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Timer from "./Timer";
import FormDialog from "./FormDialog";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
export default class LandingPage2 extends Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.refreshStocks = this.refreshStocks.bind(this);

    this.state = {
      webUrl: "",
      webDetails: [],
      listOfItems: [],
      searchedItems: [],
      seconds: 60,
      search: "",
      filter: 0,
      editMode:false,
    };

    this.deleteItem=this.deleteItem.bind(this);
  }

  componentDidMount() {
    this.getAllItems();
  }

getAllItems=()=>{
  let currentComponent=this;
  fire.database().ref('items/').on('value', function (snapshot) {
    var allItems = [];
    snapshot.forEach(function (childSnapshot) {
      allItems = allItems.concat(childSnapshot.val());
    });
    console.log(allItems);
    currentComponent.setState({
      listOfItems: allItems,
          searchedItems: allItems,
          search: "",
    });
  });
}

  onChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
    });
    if (e.target.id === "search" && e.target.value.length > 2) {
      this.handleSearch(e);
    } else if (e.target.value.length <= 2) {
      let gg = this.state.listOfItems;
      this.setState({
        searchedItems: gg,
      });
    }
  };

  handleSearch = (e) => {
    let x = this.state.listOfItems;
    let cc;
    cc = x.filter((element) => {
      const nam = element.name1;
      let check = nam.toLowerCase().includes(e.target.value.toLowerCase());
      return check ? element : null;
    });
    this.setState({
      searchedItems: cc,
    });
  };

  refreshStocks = () => {
    let len = this.state.listOfItems.length;
    if (len !== 0) {
      let itemList = {
        itemList: this.state.listOfItems,
      };
      axios.post("/api/refreshStocks", itemList).then((res) => {
        if (res.data !== null) {
          this.setState({
            listOfItems: res.data,
            searchedItems: res.data,
            search: "",
          });
        }
      });
    }
  };

  addNewItem = (data) => {
    let item = [];
    item.push(data);
    axios.post("/api/addItem", item[0]).then((res) => {
      let j=res.data;
      //toast here;
    });
    
  };

  handleFilter = (e) => {
    this.setState({
      filter: e.target.value,
    });
    let x = this.state.listOfItems;
    let cc = x.filter((ele) => {
      if (e.target.value == 0) {
        return ele;
      } else if (e.target.value === 1) {
        return ele.inStock ? ele : null;
      } else {
        return !ele.inStock ? ele : null;
      }
    });
    this.setState({
      searchedItems: cc,
    });
  };

  editMode = () =>{
    let edit=!this.state.editMode;
    this.setState({
      editMode:edit
    })
  }

  deleteItem = (item) =>{
    let itemId={ID:item.id};
    let cherry=this;
    axios.post("/api/deleteItem", itemId).then((res) => {
      //show toast for item deleted
    });
  }

  render() {
    return (
      <div className="main-body">
        <h3>Web List</h3>
        <div>
          <Timer />

          <br />
          <div className="header-buttons">
            <div className="button-style">
              <FormDialog
                sendData={(data) => this.addNewItem(data)}
              ></FormDialog>
            </div>
            {/* <div className="button-style">
              <Button
                className="button-style"
                variant="outlined"
                color="secondary"
                onClick={this.refreshStocks}
              >
                Refresh Stock
              </Button>
            </div> */}
            <div className="button-style">
            <Button
                className="button-style"
                variant="outlined"
                color="action"
                onClick={this.editMode}
              >
                Edit
              </Button>
            </div>
            
            <Select
              id="filter"
              value={this.state.filter}
              onChange={(e) => this.handleFilter(e)}
            >
              <MenuItem value={0}>
                <em>All</em>
              </MenuItem>
              <MenuItem value={1}>In Stock</MenuItem>
              <MenuItem value={2}>Out of Stock</MenuItem>
            </Select>
            
            <div className="button-style margin-end">
              <TextField
                autoFocus
                id="search"
                value={this.state.search}
                onChange={(e) => this.onChange(e)}
                label="Search By Name"
                type="text"
                fullWidth
              />
            </div>
          </div>
          <div className="all-item-list">
            {this.state.searchedItems.map((itm, index) => {
              return (
                <div key={index} className="item">
                  
                  <div className="new-old">
                    <div className="all-details">
                      <div className="item-details">
                        <h4 className="name-style">{itm.name1}</h4>
                        <h4># {itm.itemNumber1}</h4>
                        <h2>{itm.price1}</h2>
                        <a href={itm.link1} target="_blank">
                          Original Product Link
                        </a>
                      </div>
                      <div className="seperator"></div>
                      <div className="item-details">
                        <h4 className="name-style">{itm.name2}</h4>
                        <h4># {itm.itemNumber2}</h4>
                        <h2> ${itm.price2}</h2>
                        <a href={itm.link2} target="_blank">
                          Ebay Product Link
                        </a>
                      </div>
                    </div>
                    <div className="stock">
                      {itm.inStock ? (
                        <div>
                          <h2 style={{ color: "#7eff00" }}>In Stock</h2>
                        </div>
                      ) : (
                        <div>
                          <h2 style={{ color: "#FF0000" }}>Out of Stock</h2>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    {this.state.editMode ? (
                      <div className="edit-delete-buttons">
                    <IconButton aria-label="delete" onClick={()=>this.deleteItem(itm)}>
          <DeleteIcon fontSize="small" color="secondary"/>
        </IconButton>
        <IconButton aria-label="delete">
          <EditIcon fontSize="small" color="primary"/>
        </IconButton>
                    </div>
                    ):(
<div className="edit-delete-buttons"></div>
                    )}
                    
                    
                  <img className="img-style" src={itm.img} /></div>
                  
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}
