Tasks = new Mongo.Collection('tasks');

if (Meteor.isClient) {
  Meteor.subscribe('tasks');

  Template.tasks.helpers({
    tasks() {
      return Tasks.find({}, { sort: {createdAt: -1} });
    }
  });

  Template.tasks.events({
    'submit .add-task'(event) {
      event.preventDefault();
      var target = event.target;
      var name = target.name.value;

      Meteor.call('addTask', name);

      target.name.value = '';
    },

    'click .delete-task'(event) {
      if (confirm('Delete task?')) {
        Meteor.call('deleteTask', this._id);
      }
    }
  });
}

if (Meteor.isServer) {
  Meteor.publish('tasks', function() {
    console.log(this.userId);
    return Tasks.find({ userId: this.userId });
  });
}

Meteor.methods({
  addTask(name) {
    if (!Meteor.userId) throw new Meteor.Error('Access denied 401');
    if (!name.length) return;

    name = name.trim();

    Tasks.insert({
      name,
      createdAt: new Date(),
      userId: Meteor.userId()
    });
  },
  deleteTask(userId) {
    Tasks.remove(userId);
  }
});
