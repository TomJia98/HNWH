const { AuthenticationError } = require("apollo-server-express");
const { Bay, Item, HistoryEvent, Employee } = require("../models");
const { signToken } = require("../utils/auth");
// const { GraphQLDateTime } = require("graphql-iso-date");

// function requireLogIn(userId, isAdmin) {
//   if (isAdmin !== undefined) {
//     if (!userId || !isAdmin) {
//       return new Error("please log in as an admin");
//     }
//   } else {if( !userId) {
//   return new Error("please log in");
//   }}
// };

const resolvers = {
  Query: {
    item: async (parent, { productCode }, context) => {
      // search for item by product code
      const userId = context.user._id;
      if (!userId) {
        return new Error("please log in to see items");
      }
      return await Item.find({ productCode });
    },
    employee: async (parent, args, context) => {
      //sending through all a large list of args, not sure whats going to  be the best at this point in time
      const userId = context.user._id;
      const isAdmin = context.user.isAdmin;
      if (!userId || !isAdmin) {
        return new Error("please log in as an admin to see employee data");
      }
      const employee = await Employee.findOne({ args });
      return employee;
    },
    //---------------------------------^up to^----------------------------------\\

    employees: async (parent, args, context) => {
      const userId = context.user._id;
      const isAdmin = context.user.isAdmin;
      if (!userId || !isAdmin) {
        return new Error("please log in as an admin to see employees");
      }
      const employees = await Employee.find();
      return employees;
    },

    checkBay: async (parent, { bayID }, context) => {
      const userId = context.user._id;
      if (!userId) {
        return new Error("please log in to view bays");
      }
      const returnBay = await Bay.findOne({ bayID });
      if (!bayID) {
        return new Error(`unable to locate a bay by id ${bayID}`);
      }
      return returnBay;
    },
    checkHistory: async (parent, args, context) => {
      //check all history, needs admin
      const userId = context.user._id;
      const isAdmin = context.user.isAdmin;
      if (!userId || !isAdmin) {
        return new Error("Please log in as an admin to check history");
      }
      const returnedHistory = await HistoryEvent.find({});
      return returnedHistory;
    },
  },
  Mutation: {
    addEmployee: async (parent, args, context) => {
      // adds a new employee, returns the new employee, requires sign in and admin priv
      const userId = context.user._id;
      const isAdmin = context.user.isAdmin;
      if (!userId || !isAdmin) {
        return new Error("please log in as an admin to add an employee");
      }
      try {
        const newEmployee = await Employee.create(args);
        return newEmployee;
      } catch (e) {
        return new Error(e);
      }
    },

    updateEmployee: async (
      parent,
      {
        employeeID,
        password,
        employeeFirstName,
        employeeLastName,
        history,
        isAdmin,
      },
      context
    ) => {
      const userId = context.user._id;
      const isAdmin = context.user.isAdmin;
      if (!userId || !isAdmin) {
        return new Error("please log in as an admin to update an employee");
      }
      try {
        const updatedEmployee = await Employee.findOneAndUpdate(
          { employeeID },
          { password, employeeFirstName, employeeLastName, history, isAdmin },
          { new: true }
        );
        return updatedEmployee;
      } catch (e) {
        return new Error(e);
      }
    },

    deleteEmployee: async (parent, { employeeID }, context) => {
      const userId = context.user._id;
      const isAdmin = context.user.isAdmin;
      if (!userId || !isAdmin) {
        return new Error("please log in as an admin to delete an employee");
      }
      try {
        const delEmployee = await Employee.findOneAndDelete(employeeID);
        delEmployee
        // pass in the employees id to delete
        return `employee ${employeeID} has had there data deleted`;
      } catch (e) {
        return new Error(e);
      }
    },
    addBay: async (parent, args, context) => {
      const userId = context.user._id;
      const isAdmin = context.user.isAdmin;
      if (!userId || !isAdmin) {
        return new Error("please log in as an admin");
      }
      try {
        const newBay = await Bay.create({ ...args });
        return newBay;
      } catch (e) {
        return new Error(e);
      }
    },

    addMultipleBays: async (parent, {isleWidth, isleHeight, isleNumber, bayType}, context) => {
      //pass in height and width params 
      const userId = context.user._id;
      const isAdmin = context.user.isAdmin;
      if (!userId || !isAdmin) {
        return new Error("please log in as an admin");
      }
      try {
        for (i=0;i<isleWidth; i++) {
for (k=0;k<isleHeight; i++) {
  
}
        }
      } catch (e) {
        return new Error(e);
      }
    }
    createLink: async (
      //createing the linking code
      parent,
      { linkingCode, userWhoIsLinking, linkedToPerson },
      context
    ) => {
      const userId = context.user._id;
      if (!userId) {
        return new Error("user is not logged in");
      }
      try {
        const newCode = await LinkingCode.create({
          linkingCode,
          userWhoIsLinking,
          linkedToPerson,
        });
        return newCode;
      } catch (e) {
        return new Error(e);
      }
    },

    acceptLink: async (parent, { linkingCode }) => {
      //accepting the linking code, then deleting it and sending its
      //data to the user for account creation
      try {
        const findLink = await LinkingCode.findOne({ linkingCode });
        if (!findLink) {
          return new Error("no linking code found");
        } else await LinkingCode.findByIdAndDelete({ _id: findLink._id });
        return findLink;
      } catch (e) {
        return new Error(e);
      }
    },
    createLinkedUser: async (
      parent,
      { userWhoIsLinking, linkedToPerson, email, password }
    ) => {
      //values are saved as ID strings
      try {
        const findLinkedPerson = await Person.findByIdAndUpdate(
          { _id: linkedToPerson },
          { isLinked: true }
        );

        const newUser = await User.create({
          name: findLinkedPerson.name,
          password: password,
          email: email,
          person: linkedToPerson,
        });
        const updatingUsersPeopleArr = await Person.find({
          createdBy: userWhoIsLinking,
        });
        console.log(updatingUsersPeopleArr);
        console.log(userWhoIsLinking);
        for (let i = 0; i < updatingUsersPeopleArr.length; i++) {
          await Person.findByIdAndUpdate(
            { _id: updatingUsersPeopleArr[i]._id },
            { $push: { createdBy: newUser._id } }
          );
        }
        const token = signToken(newUser);

        return { token, newUser };
      } catch (e) {
        return new Error("failed to link up and create new user");
      }
    },

    addPerson: async (
      parent,
      { name, deathDate, birthday, parents, children, isClose, createdBy },
      context
    ) => {
      const user = context.user;
      if (!user) {
        return new Error("user is not logged in");
      }
      if (parents) {
        if (parents.length > 2) {
          return new Error("cant have more than 2 parents");
        }
      }
      try {
        const newPerson = await Person.create({
          name,
          deathDate,
          birthday,
          parents,
          children,
          isClose,
          isLinked: false,
          createdBy,
        });

        return newPerson;
      } catch (err) {
        console.log(err);
        return err;
      }
    },

    updateRelations: async (parent, { _ID, children, parents }, context) => {
      //just for adding parents and children
      const userId = context.user._id;
      if (!userId) {
        return new Error("user is not logged in");
      }
      try {
        const updatingPerson = await Person.findById({ _id: _ID });

        try {
          const updatePerson = await Person.findByIdAndUpdate(
            { _id: _ID },
            {
              $push: { parents: parents, children: children },
            },
            { new: true }
          );
          return updatePerson;
        } catch (e) {
          console.log(e);
        }
      } catch (e) {
        console.log(e);
      }
    },

    updatePerson: async (
      //for changing person info
      parent,
      { _ID, name, deathDate, birthday, parents, children, isClose },
      context
    ) => {
      const user = context.user;
      if (!user) {
        return new Error("No User is logged in");
      }
      if (parents) {
        if (parents.length > 2) {
          return new Error("cant have more than 2 parents");
        }
      }

      const updatingPerson = await Person.findOne({
        _id: _ID,
        createdBy: user._id,
      });

      if (updatingPerson) {
        //this runs if the two are the same
        const updatedPerson = await Person.findOneAndUpdate(
          { _id: _ID },
          {
            name,
            deathDate,
            birthday,
            parents,
            children,
            isClose,
          },
          { new: true }
        );
        return updatedPerson;
      } else {
        return new Error("cannot find person");
      }
    },
    addUser: async (parent, { name, email, password, birthday }, context) => {
      try {
        const findEmail = await User.findOne({ email });
        if (findEmail) {
          return "email address already exists";
        }

        console.log("creating new user named " + name);
        const newPerson = await Person.create({
          //create the users person before the user
          name,
          birthday,
          isLinked: true,
          isClose: false,
        });
        const id = newPerson._id.toString();

        const user = await User.create({
          //create the user and link to their person
          name,
          email,
          password,
          person: id,
        });
        const userId = user._id.toString();

        const updatedPerson = await Person.findByIdAndUpdate(
          { _id: newPerson._id },
          { createdBy: [userId] },
          { new: true }
        );
        const token = signToken(user);

        return { token, user };
      } catch (err) {
        console.log(err);

        return err;
      }
    },

    deletePerson: async (parent, { _ID }, context) => {
      const user = context.user;
      if (!user) {
        return new Error("user not logged in!");
      }
      const findPerson = await Person.findOne({ _id: _ID });
      if (findPerson.children.length === 0) {
        for (let i = 0; i < findPerson.parents.length; i++) {
          await Person.findOneAndUpdate(
            {
              _id: findPerson.parents[i],
            },
            { $pull: { children: findPerson._id } }
          );
        }
        await Person.findOneAndDelete({ _id: _ID });
        return "deleted";
      } else return "need to remove children first"; //cant delete users with history otherwise it leaves traces in the data
    },
    login: async (parent, { email, password }, context) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("No user with this email found!");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect password!");
      }

      const token = signToken(user);
      return { token, user };
    },
  },
};

module.exports = { resolvers, customScalarResolver };
