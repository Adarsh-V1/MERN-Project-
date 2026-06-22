## mongoose

Mongoose is bassically an ODM ( object data modeling libraary ) for mongo DB and node.js

MongoDB = speaks json like docuements
my app = write js objects
mongoose = translator that adds structure and rules for working with mongoDB
{
import mongoose from 'mongoose'
// we are importing mongoose to use it

      const userSchema = new mongoose.Schema({})
      // mongoose.Schema is a constructor function that creates a new schema object and defien the field structure and types and rules

      export const User = mongoose.model('User',userSchema)
      // mongoose.model -> compiles the schema into a model that can be used to interact with the database
      -> a model is just a consturctor function that you use to create and query documents in the database
      1. first argument is the name of the model (User)
         - mongoose will automatically make it lowercase and plural for the collection  (User ===> users)
      2. second argument is the schema object (userSchema)
         - defines the structure of the documents in the collection

}

      [
      type: mongoose.Schema.Types.ObjectId,
         ref:"User"

      ]

why use mongoose?
well mongoDB is schemaless , you can throw any field , any type , that flexibility is great but dangrerous , you could end up with messy inconsistent data

----> mongoose bassically solve this by

1. Defining a schema for you data
   - controls what fields a document can have
2. Validation
   - ensures data matches rules before saving
3. Middleware
   - Hoooks for running code auomatically before/after certain actions
4. built in query helpers
   - makes it easier to build complex queries
     5 - population
   - automatically replace references with actual documents

what mongoose actually does

1. schema defination
2. model creation
3. document creation
4. middleware
5. indexing
