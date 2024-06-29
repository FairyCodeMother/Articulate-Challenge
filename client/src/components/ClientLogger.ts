export const clientLogger = (type: String, thing: any) => {
  const stringThing = JSON.stringify(thing);
  const breaker = "\n #### ";

  console.log(
    breaker + "[GINASAURUS] \n" + type + "\n" + stringThing + breaker,
  );
};
