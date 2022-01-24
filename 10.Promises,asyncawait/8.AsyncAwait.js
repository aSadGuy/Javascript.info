// Async/await
console.log("--- ASYNC/AWAIT ---");

// "async/await" is a special syntax to work with promises in a more comfortable fashion.

// Async functions
console.log(" ");
console.log("--- ASYNC FUNCTIONS ---");

// The "async" keyword can be placed before a function, like this:
async function f() {
  return 1;
}

// The word "async" before a function means that a function always returns a promise.
// Other values are wrapped in a resolved promise automatically.

// For instance, this function returns a resolved promise with the result of "1":
async function f() {
  return 1;
}
f().then(console.log); // 1

// Explicitly returning a promise would be the same:
async function f() {
  return Promise.resolve(1);
}
f().then(console.log); // 1

// So, "async" ensures that the function returns a promise, and wraps non-promises in it.

// Await
console.log(" ");
console.log("--- AWAIT ---");

// Syntax:
/*
    // works only inside async functions
    let value = await promise;
*/

// The keyword "await" makes JS wait until that promise settles and returns its result.

// Example with promise that resolves in 1 second:
async function func() {
  let promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve("done"), 1000);
  });
  let result = await promise; // wait until the promise resolves (*)
  console.log(result); // done
}
func();

// The function execution "pauses" at the line "(*)" and resumes when the promise settles, with "result"
// becoming its result. So the code above shows "done" in one second.

// "await" literally suspends the function execution until the promise settles, and then resumes it with the
// promise result. That does not cost any CPU resources, becuase the JS engine can so other jobs in the meantime:
// execute other scripts, handle events, etc.

// It is just a more elegant syntax of getting the promise result than "promise.then".

// Rewrite the "showAvatar()" example from the chapter 10.3 "Promises Chaining" using "async/await":
// 1. ".then" calls will be replaced with "await".
// 2. Make the function "async" for "await" to work.

async function showAvatar() {
  // read JSON
  let response = await fetch(
    "https://javascript.info/article/promise-chaining/user.json"
  );
  let user = await response.json();

  // read github user
  let githubResponse = await fetch(`https://api.github.com/users/${user.name}`);
  let githubUser = await githubResponse.json();

  // show the avatar
  let img = document.createElement("img");
  img.src = githubUser.avatar_url;
  img.className = "promise-avatar-example";
  document.body.append(img);

  // wait 3 seconds
  await new Promise((resolve, reject) => setTimeout(resolve, 3000));
  img.remove(console.log("removed image"));
  return githubUser;
}

showAvatar();

// Error Handling
console.log(" ");
console.log("--- ERROR HANDLING ---");

// If a promise resolves normally, then "await promise" returns the result.
// But in the case of a rejection, it throws the error, just as if there were a "throw" statement at that line.

// This code:
async function f1() {
  await Promise.reject(new Error("oops"));
}

// is the same as this:
async function f2() {
  throw new Error("oops");
}

// In real situations, the promise may take some time before it rejects.
// In that case there will be a delay before "await" throws an error.

// Catch error using "try..catch", the same way as a regular "throw":
async function f3() {
  try {
    let response = await fetch("http://no-such-url");
  } catch (err) {
    console.log(err);
  }
}
f3();

// In the case of an error, the control jumps to the "catch" block. Can also wrap multiple lines:
async function f4() {
  try {
    let response = await fetch("/no-user-here");
    let user = await response.json();
  } catch (err) {
    // catched errors both in fetch response.json
    console.log(err);
  }
}
f4();

// If there is no "try..catch", then the promise generated by the call of the async function "f4()" becomes rejected.
// Append ".catch" to handle it:
async function f5() {
  let response = await fetch("https://no-such-url");
}
// f5() becomes a rejected promise
f5().catch(console.log); // TypeError: failed to fetch (*)

// If ".catch" is not added, then returns an unhandled promise error.
// "unhandledrejection" event handler can be used to catch such errors.

