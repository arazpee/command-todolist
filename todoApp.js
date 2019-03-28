const client = require("redis").createClient({ host: '127.0.0.1' });
const prompts = require('prompts');

const prompt = async () => {
  const response = await prompts({
    type: 'select',
    name: 'menu',
    message: 'what would you do',
    choices: [
      { title: 'Add Todo-list', value: 'add' },
      { title: 'Delete Task', value: 'del' },
      { title: 'Display all', value: 'display' },
      { title: 'exit', value: 'exit' }
    ],
  }, {
    onSubmit: async (prompt, response) => {
      if(response == 'add') {
        let numplus = 1;
        const call = async () => {
          const data = await prompts({
            type: 'text',
            name: 'add',
            message: 'Enter your todolist you want to save'
          });
          if(data.add !== "") {
            await client.hset("test", data.add, numplus, () => {
              console.log('\n You have entered task, type to add more or leave blank to exit');
            });
            numplus++;
            call();
          } else {
            console.log(data.add);
            return process.exit();
          }
        };
        call();

      } else if (response == 'del') {
        let holdOb = {};
        await client.hkeys("test", function (err, data) {
          console.log("You have " + data.length + "todo-lists");
          data.forEach(function (item, index) {
            holdOb[index] = item;
            console.log(index +" : "+ item);
          });
        });
        const data = await prompts({
          type: 'text',
          name: 'del',
          message: 'Enter your number of todolist you want to delete'
        });
        await client.hdel("test", holdOb[data.del]);
        process.exit();

      } else if (response == 'display') {
        client.hkeys("test", function (err, data) {
          console.log("You have " + data.length + "todo-lists");
          data.forEach(function (item, index) {
              console.log(" " + index + ": " + item);
          });
        });

      } else {
        process.exit();
      }
    }
  });
}
prompt();
