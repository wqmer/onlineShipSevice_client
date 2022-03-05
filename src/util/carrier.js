export const handle_surcharge = function (type, surChargeObj) {
  // console.log(type);
  // console.log(surChargeObj);

  let result = {
    name: "未识别附加费",
    amount: "??",
  };

  try {
    switch (type.toUpperCase()) {
      case "FEDEX":
        let surchageName = {
          FUEL: "燃油附加费",
          RESIDENTIAL_DELIVERY: "住宅附加费",
          DELIVERY_AREA: "偏远附加费费",
        };

        result.name = surchageName[surChargeObj.SurchargeType]
          ? surchageName[surChargeObj.SurchargeType]
          : surChargeObj.SurchargeType;
        result.amount = surChargeObj.Amount.Amount;

        break;
      case "UPS":
        let surchageCode = {
          375: "燃油附加费",
          376: "偏远附加费",
          270: "住宅附加费",
          190: "超偏远附加费",
          400: "保险费附加费",
        };
        result.name = surchageCode[surChargeObj.Code]
          ? surchageCode[surChargeObj.Code]
          : "UPS附加费代码" + surChargeObj.Code;
        result.amount = surChargeObj.MonetaryValue;
        // code block
        break;
      default:
        result = result;
      // code block
    }
    return result;
  } catch (err) {
    console.log("未识别附加费，发生错误 " + err);
    let result = {
      name: "未识别附加费",
      amount: "??",
    };
    return result;
  }
};

export const handle_ups_extra_surcharge = function (type, surChargeArray) {
  // console.log(type);
  // console.log(surChargeObj);
  let surchageCode = {
    375: "燃油附加费",
    376: "偏远附加费",
    270: "住宅附加费",
    190: "超偏远附加费",
    400: "保险费附加费",
  };

  //  ItemizedCharges: { Code: '270', CurrencyCode: 'USD', MonetaryValue: '43.20' },

  try {
    let result = {
      total: surChargeArray
        .map((item) => Number.parseFloat(item.MonetaryValue))
        .reduce((a, c) => a + c)
        .toFixed(2),
      items: surChargeArray.map((e) => {
        return {
          name: surchageCode[e.Code]
            ? surchageCode[e.Code]
            : "UPS附加费代码" + e.Code,
          amount: e.MonetaryValue,
        };
      }),
    };
    return result;
  } catch (err) {
    console.log("未识别附加费，发生错误 " + err);
    let result = {
      total: 0,
      items: [],
    };
    return result;
  }
};

export const handle_total_charge = function (type, detail) {
  // console.log(type);
  // console.log(surChargeObj);

  let result = { total_base_amount: 0, total_surcharge_amount: 0 };
  let { total_amount, total_base_amount, total_surcharge_amount } = result;

  try {
    if (detail) {
      result.total_base_amount = detail
        .map((item) => Number.parseFloat(item.basePrice))
        .reduce((a, c) => a + c)
        .toFixed(2);

      switch (type.toUpperCase()) {
        case "FEDEX":
          result.total_surcharge_amount = detail
            .map((item) => {
              if(!item.surCharges)return [0]
              return item.surCharges.map((e) => e.Amount.Amount);
            })
            .flat()
            .reduce((a, c) => a + c)
            .toFixed(2);

          break;
        case "UPS":
          result.total_surcharge_amount = detail
            .map((item) =>
              item.surCharges.map((e) => Number.parseFloat(e.MonetaryValue))
            )
            .flat()
            .reduce((a, c) => a + c)
            .toFixed(2);
          break;
        default:
          total_base_amount = 0;
          total_surcharge_amount = 0;
        // code block
      }
    }
    // console.log("total base is " + total_base_amount.toString());
    result.total_amount =
      parseFloat(result.total_surcharge_amount) +
      parseFloat(result.total_base_amount);
    result.total_amount = result.total_amount.toFixed(2);
    return result;
  } catch (err) {
    console.log("发生错误 " + err);
    let result = {
      total_base_amount: "??",
      total_surcharge_amount: "??",
      total_amount: "???",
    };
    return result;
  }
};
