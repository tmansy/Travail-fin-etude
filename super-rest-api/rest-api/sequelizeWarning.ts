export class SequelizeWarning {
  public message = ""
  constructor(message = "Warning") {
    this.message = message;
  }
}

export class SequelizeTeapot {
  public message = ""
  constructor(message = "Error") {
    this.message = message;
  }
}

export class SequelizeForbidden {
  public message = ""
  constructor(message = "Error") {
    this.message = message;
  }
}