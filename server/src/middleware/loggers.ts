export const logger = (thing: Object, type: String) => {
  const stringThing = JSON.stringify(thing);
  const breaker = "\n #### ";

  console.log(
    breaker + "[GINASAURUS] \n" + type + "\n" + stringThing + breaker,
  );
};
