const mapOptions = (options: [{ name: string; value: string }]) =>
  options.reduce((acc, option) => {
    acc[option.name] = option.value;
    return acc;
  }, {} as { [key: string]: string });

export default mapOptions;
