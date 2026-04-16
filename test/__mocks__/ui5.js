jest.mock(
  "sap/ui/model/type/Currency",
  () => function Currency() {},
  { virtual: true }
);

jest.mock(
  "sap/ui/core/format/DateFormat",
  () => ({
    getInstance: ({ pattern }) => ({
      format: (date) => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();

        if (pattern === "dd.MM.yyyy") {
          return `${day}.${month}.${year}`;
        }
        if (pattern === "dd MMMM yyyy") {
          return `${day} January ${year}`;
        }
        return "";
      }
    })
  }),
  { virtual: true }
);

jest.mock(
  "sap/ui/core/date/UI5Date",
  () => ({
    getInstance: (date) => new Date(date)
  }),
  { virtual: true }
);