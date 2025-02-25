# Systems Model Project

_If using AI, please see [my AI prompt](./src/sims/ai-prompt.md)_

For this project, you will be editing code in `src/sims/`. I have already created the _handshake game_ we played in class in a simple web app as a model for you.

You can modify that game if you like, but your requirement is to complete _simulationOne_ and _simulationTwo_ which are in that folder.

For your first challenge, you will be introducing _one_ variable into a basic
infection scenario.

For your _second_ challenge, you will be attempting to simulate a _real world_ disease and/or intervention based on some background research.

In every case, it is vital that you be able to move up and down the ladder of abstraction from a basic description of how your model works (i.e. how you would create a classroom simulation like the one we did) to an understanding of how the
web application works.

## Getting started:

TO get started, take a look at [simulationOne](./src/sims/simulationOne/diseaseModel.js). Before you ask for help from AI, fill in the comments in that file with a _plan_ based on what your group does.

Once you've done that, try to read through the template code and figure out what
you need to add. If you're not sure how to write it in JavaScript, I recommend first
putting in comments with `// slash comment syntax` saying what you're trying to do.

_Before using AI_, always **commit** a version of your code to version control. That way, you will easily be able to see what changes AI is suggested using version control, and you also can make sure to give credit in your commit history any time you are getting help from a computer.

Once you have a plan and have started trying to code, you can paste the contents of your file as well as my [AI prompt](./src/sims/ai-prompt.md) into AI in order to get some help converting your ideas into JavaScript.

Note: if you want to add additional parameters to your model (i.e. let the user enter a number or choose a value on a slider), you will also need to make some changes to the `Simulation.jsx` file which is written in a simplified version of
React.

Note: you can also change the display of your "patients" by changing Simulation.jsx. You'll see right now it uses a simple set of emojis to display patients based
on whether they are infected or not.

Finally: when you want to change the names of your simulations in the menu, you'll
need to edit some text in App.jsx which is where the simulation chooser code is.
