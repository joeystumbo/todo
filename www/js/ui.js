let ui = (function(){
  "se strict";

  const uuid = ()=> {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
    });
  }

  async function get_all(){
    const response = await fetch('/get_all');
    const json_value = await response.json();
    return json_value;
  }

  async function add_todo(value, unique){
    const response = await fetch('/add?todo=' + value + '&uuid=' + unique);
    const json_value = await response.json();
    return json_value;
  }

  async function remove_todo(value){
    const response = await fetch('/remove?uuid=' + value);
    const json_value = await response.json();
    return json_value;
  }


  const create_item =(value, unique)=>{
    let list = document.getElementById('todo-list');
    let element = document.createElement('li');
    let btn = document.createElement('button');

    btn.classList.add("btn");
    btn.classList.add("btn-outline-danger");
    btn.style.float = 'right';
    btn.innerHTML = "remove";
    btn.setAttribute('uuid', unique);
    btn.addEventListener("click", (e)=>{
    
      //fetch
      remove_todo(unique).then(value =>{
        if(value.response === true){
           let li = e.srcElement.parentNode;
           let ul = li.parentNode
           ul.removeChild(li);
        }
        else{
          //error ????
          notify("can't remove the task");
        }
      
      });

    });

    
    element.classList.add("list-group-item");
    element.innerHTML = value;
    element.appendChild(btn);
    list.appendChild(element);
    list.scrollIntoView({behavior: "smooth", block: "end"});
  }

  const notify=(value)=>{
    let notify = document.getElementById('notify');
    let msg = notify.getElementsByClassName('toast-body');
    msg[0].innerHTML = value || "Something is wrong...";
    notify.style.opacity = 1;
    setTimeout(()=>{
      notify.style.opacity = 0;
    },4000);
  }


  const init = ()=>{

    //prepare the main button to work
    let btn = document.getElementById('add-btn');
    btn.addEventListener("click", (e)=>{
      e.preventDefault();
      //fetch
      let todo = document.getElementById('new-todo');
      if(todo.value.length === 0){
        notify("please add a task !");
        return false;

      }else{
         let unique = uuid();
         add_todo(todo.value, unique).then(value =>{
          if(value.response === true){
            create_item(todo.value, unique);
            todo.value = "";
          }
          else{
            //error ????
            notify("can't add the task");
          }
        
        })
      }
    });

    
    //get all the available data and fill the UI
    get_all().then(value =>{
      console.warn(value);
      if(Object.keys(value).length > 0){
        for (const [key, val] of Object.entries(value)) {
          create_item(val.msg, key);
        }
      }
    });

  }

  //--------------------------------->
  //exposed methods
  //public scope
  return{
    init: init
  }


}());