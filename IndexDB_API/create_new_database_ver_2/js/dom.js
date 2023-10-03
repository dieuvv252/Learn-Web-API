import DatabaseIndex from "./database.js";

export default class DOMAPI {
  constructor() {
    this.databaseIns = new DatabaseIndex("users", 2, "members");
  }

  init() {
    this.databaseIns.openDb();

    this.getEleById("btn-add").addEventListener("click", () => {
      const valueId = this.getValueElemenet("id");
      const valueName = this.getValueElemenet("name");
      const valueEmail = this.getValueElemenet("email");

      this.databaseIns.addItemToStore(
        {
          name: valueName,
          email: valueEmail,
          id: valueId,
        },
        "members"
      );
    });
  }

  getEleById(id) {
    return document.getElementById(id);
  }

  setValueElement(id, value) {
    return (this.getEleById(id).value = value);
  }

  getValueElemenet(id) {
    return this.getEleById(id).value;
  }

  clearForm() {
    this.setValueElement("id", null);
    this.setValueElement("name", "");
    this.setValueElement("id", "");
  }
}
