var express = require("express");
var router = express.Router();
var db = require("../mySql");
/* GET users listing. */
router.get("/", (req, res, next) => {
  db.query("SELECT * FROM datausers.taskkeeper", function (err, rows, fields) {
    if (err) {
      res.status(500).json({
        "status code": 500,
        "status messenger": err.message,
      });
    } else {
      res.json(rows);
    }
  });
});
router.post("/", async (req, res) => {
  const { coure, nameUser, createTime, status } = req.body;

  try {
    await db.query(
      "INSERT INTO taskkeeper (coure, nameUser, createTime,status) VALUES (?,?,?,?)",
      [coure, nameUser, createTime, status]
    );
    res.status(201).send("Đã thêm task");
  } catch (error) {
    console.log(error);
    res.status(500).send("Database insertion error");
  }
});

router.put("/:userID", async (req, res) => {
  const { coure, nameUser, createTime, status } = req.body;
  const { userID } = req.params;

  try {
    await db.query(
      "UPDATE taskkeeper SET coure = ?, nameUser = ?, createTime = ?, status = ? WHERE userID = ?",
      [coure, nameUser, createTime, status, userID]
    );

    res.status(200).send("Đã cập nhật task");
  } catch (error) {
    console.log(error);
    res.status(500).send("Database update error");
  }
});

router.delete("/:id", async (req, res) => {
  console.log("id trả về", req.params.id);
  await db.query("DELETE FROM taskkeeper WHERE userID = ?", [req.params.id]);
  res.status(204).end();
});
module.exports = router;
