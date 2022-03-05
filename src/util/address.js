const getAddressComponent = (address_array, type) => {
  return address_array.find((item) => _.isEqual(item.types, type))
    ? address_array.find((item) => _.isEqual(item.types, type)).short_name
    : "";
};

const getState = (address_array) =>
  getAddressComponent(address_array, ["country", "political"]) == "US"
    ? getAddressComponent(address_array, [
        "administrative_area_level_1",
        "political",
      ])
    : getAddressComponent(address_array, ["country", "political"]);

const getCity = (address_array) => {
  let result;
  switch (true) {
    case getAddressComponent(address_array, ["locality", "political"]) != "":
      result = getAddressComponent(address_array, ["locality", "political"]);
      break;
    case getAddressComponent(address_array, [
      "sublocality_level_1",
      "sublocality",
      "political",
    ]) != "":
      result = getAddressComponent(address_array, [
        "sublocality_level_1",
        "sublocality",
        "political",
      ]);
      break;
    case getAddressComponent(address_array, ["neighborhood", "political"]) !=
      "":
      result = getAddressComponent(address_array, [
        "neighborhood",
        "political",
      ]);
      break;
    default:
    // code block
  }
  console.log("getCity is " + result);
  return result;
};

const getZipCode = (address_array) =>
  getAddressComponent(address_array, ["postal_code"]);

export const get_google_address = function (address_obj) {
  try {
    let address_array = address_obj.address_components;

    let address_name = address_obj.name;
    console.log(address_array);
    let address = {};

    address = {
      add1: address_name,
      city: getCity(address_array),
      state: getState(address_array),
      zip_code: getZipCode(address_array),
    };

    return address;
  } catch (err) {
    console.log(err);
  }
};

export const get_address_title = function (address_obj) {
  let {
    Company,
    sender_name,
    recipient_name,
    add1,
    add2,
    city,
    phone_number,
    state,
    zipcode,
  } = address_obj;

  sender_name = sender_name ? sender_name + ", " : "";
  recipient_name = recipient_name ? recipient_name + ", " : "";
  Company = Company ? Company + ", " : "";
  add2 = add2 ? add2 + ", " : "";

  try {
    return (
      Company +
      sender_name +
      recipient_name +
      phone_number +
      ", " +
      add1 +
      ", " +
      add2 +
      city +
      ", " +
      state +
      " " +
      zipcode
    );
  } catch (err) {
    console.log(err);
  }
};

export const get_full_address = function (address_obj) {
  let {
    company,
    first_name,
    last_name,
    address_one,
    address_two,
    city,
    phone_number,
    state,
    zip_code,
  } = address_obj;

  first_name = first_name ? first_name : "";
  last_name = last_name && last_name.length > 0 ? " " + last_name + ", " : ", ";
  company = company ? company + ", " : "";
  address_two = address_two ? address_two + ", " : "";

  try {
    return (
      company +
      first_name +
      last_name +
      phone_number +
      ", " +
      address_one +
      ", " +
      address_two +
      city +
      ", " +
      state +
      " " +
      zip_code
    );
  } catch (err) {
    console.log(err);
  }
};
