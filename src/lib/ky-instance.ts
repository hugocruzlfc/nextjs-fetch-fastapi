import ky from "ky";

const kyInstance = ky.create({
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
});

export default kyInstance;
