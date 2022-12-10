import fs from "node:fs/promises";
import readline from "node:readline/promises";
import { exit, stdin as input, stdout as output } from "node:process";

const rl = readline.createInterface({ input, output });
const path = "./db.json";

const run = async () => {
  const action = await getAction();
  if (action === "L") {
    const user = await login();

    try {
      const fh = await fs.open(path);
      let data = await fh.readFile("utf-8");
      data = JSON.parse(data);
      data.users.push(user);
      const jsondb = JSON.stringify(data);
      await fs.writeFile(path, jsondb, "utf-8");
      console.log("User was added successfully.");
      rl.close();
      return;
    } catch (error) {
      const db = {
        users: [],
      };
      db.users.push(user);
      const jsondb = JSON.stringify(db);
      await fs.writeFile(path, jsondb, "utf-8");
      console.log("User was added successfully.");
      rl.close();
      return;
    }
  } else if (action === "S") {
    const id = await search();
    try {
      const fh = await fs.open(path);
      let data = await fh.readFile("utf-8");
      data = JSON.parse(data);
      const res = data.users.find((user) => user.id === id);
      if (res) {
        console.log(res);
        rl.close();
        return;
      }
      console.log("No user found.");
      rl.close();
      return;
    } catch (error) {
      console.log("No user found.");
      rl.close();
      return;
    }
  } else if (action === "E") {
    console.log("Bye-Bye!");
    exit(0);
  }
};

const search = async () => {
  const id = await rl.question("Enter an ID to search for: ");
  return id;
};

const login = async () => {
  const fname = await rl.question("What is your first name? ");
  const lname = await rl.question("What is your last name? ");
  const email = await rl.question("What is your email? ");
  const country = await rl.question("What is your country? ");
  const city = await rl.question("What is your city? ");
  const dob = await rl.question("What is your date of birth? ");
  const id = await rl.question("What is your id? ");
  const user = {
    fname,
    lname,
    email,
    country,
    city,
    id,
  };
  return user;
};

const getAction = async () => {
  let action;
  while (action !== "L" || action !== "S" || action !== "E") {
    action = await rl.question(
      "Hello! Press 'L' to Login, 'S' to search for a user, or 'E' to exit. "
    );
    if (action === "L" || action === "S" || action === "E") {
      return action;
    }
  }
};

run();
