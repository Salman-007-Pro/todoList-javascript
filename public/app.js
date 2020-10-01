//yeh structure data manager hai
let dataController = (() => {
  let incompleteTask = function (id, text) {
    (this.id = id), (this.text = text), (this.date = getDate());
  };
  let completeTask = function (id, text) {
    (this.id = id), (this.text = text), (this.date = getDate());
  };
  let getDate = () => {
    let fullDate, date, mon, months, year, std, hour, min, time, sec;
    months = [
      "Jan",
      "Feb",
      "Mar",
      "April",
      "May",
      "June",
      "July",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    fullDate = new Date();
    date = fullDate.getDate();
    mon = fullDate.getMonth();
    year = fullDate.getFullYear();
    hour = fullDate.getHours();
    min = fullDate.getMinutes();
    mon = months[mon];
    sec = fullDate.getSeconds();
    std = `${date}:${mon}:${year}`;
    if (hour > 11) {
      hour = (hour % 12) + "";
      hour.length == 2 ? hour : (hour = "0" + hour);
      time = `${hour}:${min}:${sec} PM`;
    } else {
      ur = (hour % 12) + "";
      hour.length == 2 ? hour : (hour = "0" + hour);
      time = `${hour}:${min}:${sec} AM`;
    }
    std = time + " / " + std;
    return std;
  };
  let data = {
    allItem: {
      incomp: [],
      comp: [],
    },
    completedTask: [],
  };
  return {
    publicTest: () => {
      console.log(data);
    },
    addItem: (text, type) => {
      let id, item;
      if (data.allItem[type].length > 0) {
        id = data.allItem[type][data.allItem[type].length - 1].id + 1;
      } else {
        id = 0;
      }
      if (type === "incomp") {
        item = new incompleteTask(id, text);
      } else {
        item = new completeTask(id, text);
      }
      data.allItem[type].push(item);
      return item;
    },
    delItem: (type, id) => {
      let Ids, index;
      Ids = data.allItem[type].map((cur) => {
        return cur.id;
      });
      index = Ids.indexOf(id);
      data.allItem[type].splice(index, 1);
    },
    getItemText: (type, id) => {
      let Ids, index, description;
      Ids = data.allItem[type].map((cur) => {
        return cur.id;
      });
      index = Ids.indexOf(id);
      description = data.allItem[type][index].text;
      return description;
    },
    getWholeItem: (id) => {
      let Ids, index;
      Ids = data.allItem.comp.map((cur) => {
        return cur.id;
      });
      index = Ids.indexOf(id);
      return data.allItem.comp[index];
    },
    addCompleteTask: (item) => {
      if (item) {
        alert("you stored the task into database");
        data.completedTask.push(item);
      } else {
        alert("you not stored the task into database!!!");
      }
    },
  };
})();

// yeh data ko ui show kara ne ke liye hai
let UIController = (() => {
  let domString = {
    inputText: ".input-text",
    myBtn: ".myBtn",
    inCompleteList: ".incomplete-list",
    completeList: ".complete-list",
    incompDel: "#incomp-del",
    incompAdd: "#incomp-add",
    compSuc: "#comp-succ",
    compDel: "#comp-del",
  };

  return {
    getInput: () => {
      return $(domString.inputText).val();
    },
    getDomString: () => {
      return domString;
    },
    displayItem: (item, type) => {
      let html, element;
      if (type === "incomp") {
        element = domString.inCompleteList;
        html = `<div class="item-list item-list--red clearFix" id="incomp-${item.id}">
            <h3 class="h3 teritary-heading color--red">
                ${item.text} 
                <div class="date">(${item.date})</div>
            </h3>
            <div class="icons">
                <button class="icon-1 icon-color-red" id="incomp-del">
                    <span class="ion-close-round"></span>
                </button>
                <button class="icon-2 icon-color-green" id="incomp-add">
                    <span class="ion-checkmark"></span>
                </button>
                 </div>
            </div>`;
      } else {
        element = domString.completeList;
        html = `<div class="item-list item-list--green clearFix" id="comp-${item.id}">
                <h3 class="teritary-heading color--green">
                    ${item.text} 
                    <div class="date">(${item.date})</div>
                </h3>
                <div class="icons color--green">
                    <button class="icon-1 icon-color-green" id="comp-succ">
                        <span class="ion-checkmark"></span>
                    </button>
                    <button class="icon-2 icon-color-red" id="comp-del">
                        <span class="ion-close-round"><span>
                    </button>
                </div>
            </div>`;
      }

      $(element).append(html);
    },
    clearField: () => {
      $(domString.inputText).val("").focus();
    },
    deleteItem: (item) => {
      $("#" + item).hide("slow", function () {
        $("#" + item).remove();
      });
    },
  };
})();

//yeh dono controller ko control kar ne ke liye hai
let controller = ((dataCtrl, UICtrl) => {
  let setupListener = () => {
    let DomString = UICtrl.getDomString();

    $(DomString.myBtn).click(addCtrlItem);

    $(DomString.inCompleteList).click(identifyId);

    $(DomString.completeList).click(identifyId);

    $("html").keypress((e) => {
      if (e.keyCode === 13 || e.which === 13) addCtrlItem();
    });

    console.log("The Application has Started");
  };
  let addCtrlItem = () => {
    let inputData, newItem;
    //1. get input from the user
    inputData = UICtrl.getInput();

    if (inputData) {
      //2. add the input into data Structure
      newItem = dataCtrl.addItem(inputData, "incomp");

      //3. display the input in UI
      UICtrl.displayItem(newItem, "incomp");

      //4. clear the input field
      UICtrl.clearField();
    }else{
        alert("Plz Enter the input Text");
    }
  };
  let identifyId = (e) => {
    let itemId;
    itemId = e.target.parentNode.parentNode.parentNode.id;
    if (
      e.target.parentNode.id === "incomp-del" ||
      e.target.id === "incomp-del"
    ) {
      if (e.target.id === "incomp-del") {
        itemId = e.target.parentNode.parentNode.id;
      }
      delItem(itemId);
    }
    if (
      e.target.parentNode.id === "incomp-add" ||
      e.target.id === "incomp-add"
    ) {
      if (e.target.id === "incomp-add") {
        itemId = e.target.parentNode.parentNode.id;
      }
      addItemCompleteList(itemId);
    }
    if (e.target.parentNode.id === "comp-succ" || e.target.id === "comp-succ") {
      if (e.target.id === "comp-succ") {
        itemId = e.target.parentNode.parentNode.id;
      }
      delAndStore(itemId);
    }
    if (e.target.parentNode.id === "comp-del" || e.target.id === "comp-del") {
      if (e.target.id === "comp-del") {
        itemId = e.target.parentNode.parentNode.id;
      }
      delItem(itemId);
      dataCtrl.addCompleteTask("");
    }
  };
  let delAndStore = (itemId) => {
    let splitId, type, id, item;
    //1. get the item id
    splitId = itemId.split("-");
    type = splitId[0];
    id = parseInt(splitId[1]);

    //2. get the whole item info
    item = dataCtrl.getWholeItem(id);

    //3. add item into completedTask data array
    dataCtrl.addCompleteTask(item);

    //4. del item from UI
    delItem(itemId);
  };
  let delItem = (itemId) => {
    let splitId, type, id;
    //1. get the item id
    splitId = itemId.split("-");
    type = splitId[0];
    id = parseInt(splitId[1]);

    //2. delete item from data structure
    dataCtrl.delItem(type, id);

    //3. del item from UI controller
    UICtrl.deleteItem(itemId);
  };
  let addItemCompleteList = (itemId) => {
    let splitId, type, id, text, newItem;
    //1. get the item id
    splitId = itemId.split("-");
    type = splitId[0];
    id = parseInt(splitId[1]);

    //2. get item text into incomplete list
    text = dataCtrl.getItemText(type, id);

    //3. create the object of complete of new item
    newItem = dataCtrl.addItem(text, "comp");

    //4. add item into display
    UICtrl.displayItem(newItem, "comp");

    //5. delete item from data structure
    dataCtrl.delItem(type, id);

    //6 delete item from ui
    UICtrl.deleteItem(itemId);
  };
  return {
    init: () => {
      setupListener();
    },
  };
})(dataController, UIController);
controller.init();
