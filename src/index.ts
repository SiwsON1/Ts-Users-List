const inquirer = require('inquirer');
const consola = require('consola');

enum Action {
  List = "list",
  Add = "add",
  Remove = "remove",
  Edit = "edit",
  Quit = "quit"
}

type InquirerAnswers = {
  action: Action
}

enum MessageVariant {
  Success = 'success',
  Error = 'error',
  Info = 'info',
}

class Message {


  constructor(public content: string) {
    
  }
  public show(): void {
    console.log(this.content)
  }
 
  capitalize(): void {
    this.content = this.content.charAt(0).toUpperCase() + this.content.slice(1).toLowerCase();
  }

  toUpperCase(): void {
    this.content = this.content.toUpperCase();
  }
  toLowerCase(): void {
    this.content = this.content.toLowerCase();
  }
  public static showColorized(variant: MessageVariant, text :string): void {
    switch(variant){
      case MessageVariant.Success:
      consola.success(text);
      break;
      case MessageVariant.Error:
      consola.error(text);
      break;
      case MessageVariant.Info:
      consola.info(text);
      break;
    }
  }
}

type Users = {
  name: string;
  age: number;
}

class UsersData {

  data: Users[] = [];

showAll(): void {
  consola.info("Users data");
  if(this.data.length > 0){
console.table(this.data)
  }else{
    console.log("No data...")
  }
}

 public add(user: Users) {
  if (
    typeof user.name === "string" &&
    typeof user.age === "number" &&
    user.age > 0 &&
    user.name.length > 0
  ) {
    this.data.push(user);
    Message.showColorized(MessageVariant.Success, "User has been successfully added!");
  } else {
    Message.showColorized(MessageVariant.Error, "Wrong data!");
  }
}

public remove(userName: string){
  const index = this.data.findIndex((user) => user.name === userName);
  if (index !== -1) {
    this.data.splice(index, 1);
    Message.showColorized(MessageVariant.Success, "User deleted!");
  } else {
    Message.showColorized(MessageVariant.Error, "User not found...");
  }
}

public edit(editName: string, user: Users) {
  const index = this.data.findIndex((obj) => obj.name === editName);

  if (index !== -1) {
    this.data[index].name = user.name;
    this.data[index].age = user.age;
    Message.showColorized(MessageVariant.Success, 'User data has been edited!');
  } else {
    Message.showColorized(MessageVariant.Error, 'User not found...');
  }
}

}

const users = new UsersData();
console.log("\n");
console.info("???? Welcome to the UsersApp!");
console.log("====================================");
Message.showColorized(MessageVariant.Info, "Available actions");
console.log("\n");
console.log("list – show all users");
console.log("add – add new user to the list");
console.log("remove – remove user from the list");
console.log("edit – edit user from the list");
console.log("quit – quit the app");
console.log("\n");


const startApp = () => {
  inquirer.prompt([{
    name: 'action',
    type: 'input',
    message: 'How can I help you?',
  }]).then(async (answers: InquirerAnswers) => {
    
    switch (answers.action) {
      case Action.List:
        users.showAll();
        break;
      case Action.Add:
        const user = await inquirer.prompt([{
          name: 'name',
          type: 'input',
          message: 'Enter name',
        }, {
          name: 'age',
          type: 'number',
          message: 'Enter age',
        }]);
        users.add(user);
        break;
      case Action.Remove:
        const name = await inquirer.prompt([{
          name: 'name',
          type: 'input',
          message: 'Enter name',
        }]);
        users.remove(name.name);
        break;
      case Action.Edit:
        const EditName = await inquirer.prompt([{
          name: 'editName',
          type: 'input',
          message: 'Enter name to edit'
        }]);
        const editData = await inquirer.prompt([{
          name: 'name',
          type: 'input',
          message: 'Enter new name'
        },
        {
          name: 'age',
          type: 'number',
          message: 'Enter new age'
        }]);
        users.edit(EditName.editName, editData);
        break
      case Action.Quit:
        Message.showColorized(MessageVariant.Info, "Bye bye!");
        return;
      default:
        Message.showColorized(MessageVariant.Error, 'Command not found')
        break
    }

    startApp();
  });
}

startApp();