const express = require('express');
const router = express.Router();
const { Task, List } = require('../models/todo');
const defaultTasks = require('../models/default-todos');
const _ = require('lodash');
const authenticateToken = require('../middlewares/jwt-middleware');

router.get('/read-all', authenticateToken, function (req, res) {
  console.log(req.user);
  Task.find({ user: req.user.id }, async function (err, foundTasks) {
    if (err) {
      console.log('Error while get todos for the user -> ', err);
    } else {
      if (foundTasks.length === 0) {
        const insertTasks = async () => {
          for (const element of defaultTasks) {
            const newTask = new Task({
              name: element,
              user: req.user.id
            });
            await newTask.save();
          }
        };

        insertTasks().then(() => {
          res.redirect('/read-all');
        });
      } else {
        res.render('list', {
          listTitle: 'Today',
          newTasks: foundTasks,
          userName: req.user.username
        });
      }
    }
  });
});

router.post('/add-todo', authenticateToken, function (req, res) {
  const taskName = req.body.task;
  const listName = req.body.listName;
  const userId = req.user.id;

  const newTask = new Task({
    name: taskName,
    user: userId
  });

  if (listName === 'Today') {
    newTask.save();
    res.redirect('/read-all');
  } else {
    List.findOne(
      { name: listName, user: req.user.id },
      function (err, foundList) {
        if (err) {
          console.log('Error while deleting list is -> ' + err);
        } else {
          foundList.tasks.push(newTask);
          foundList.save();
          res.redirect('/new/' + listName);
        }
      }
    );
  }
});

router.post('/delete-todo', authenticateToken, function (req, res) {
  const checkedTask = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === 'Today') {
    Task.findByIdAndRemove(checkedTask, function (err) {
      console.log('Deletion Successful!');
      res.redirect('/read-all');
    });
  } else {
    List.findOneAndUpdate(
      { name: listName, user: req.user.id },
      { $pull: { tasks: { _id: checkedTask } } },
      function (err, foundCustomList) {
        if (err) {
          console.log('Error while deleting custom list is -> ' + err);
        } else {
          res.redirect('/new/' + listName);
        }
      }
    );
  }
});

router.get('/new/:customListTitle', authenticateToken, function (req, res) {
  customListTitle = _.capitalize(req.params.customListTitle);

  List.findOne(
    { name: customListTitle, user: req.user.id },
    function (err, foundList) {
      if (err) {
        console.log('The error is -> ' + err);
      } else {
        if (!foundList) {
          // Create a new list

          const customList = new List({
            name: customListTitle,
            user: req.user.id,
            items: []
          });

          customList.save();
          res.redirect('/new/' + customListTitle);
        } else {
          // Show an existing list

          res.render('list', {
            listTitle: foundList.name,
            newItems: foundList.tasks,
            userName: req.user.username
          });
        }
      }
    }
  );
});

module.exports = router;
