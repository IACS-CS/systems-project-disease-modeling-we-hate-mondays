### **Using AI for Your Systems Model**
AI can help you turn your ideas into code, but you should first develop a clear plan for how your model works.  
Think through your process, sketch out a flowchart if needed, and be ready to explain what happens each round of the simulation.

Once you have a clear idea, you can paste in your **full `diseaseModel.js` code** and ask AI for help.  
Here is an **additional paragraph** you should give AI when asking for assistance:

---
🚀 **AI Prompt for Help:**

I am creating an agent-based systems model in JavaScript with a React front-end. My model calls `updatePopulation` once per round of my disease simulation.  

I am a beginner student, so when helping me, please:  
- **Avoid compact patterns** like ternary statements, `map()`, `filter()`, and `reduce()`.  
- **Use explicit, straightforward `if` statements and `for` loops** instead.  
- **Keep React state management simple** → Each simulation is a **top-level component** with **all state in one place** (no extra components or prop-drilling).  
- **Break JSX into functions instead of using inline ternaries** → If a condition is needed, **use a separate helper function** rather than inlining logic.  

Before generating code, **ask clarifying questions** to ensure I have fully thought through my model.  
Make sure I have shared my **`Simulation.jsx` and `diseaseModel.js` files** so your response works within my teacher’s template.

Remind me to commit my code to version control before pasting in any edits made by AI and remind me I need to give credit in my version control notes as well as in comments in my code whenever I add AI. When you make changes to my code, please try
to add comments indicating what you've done, giving yourself credit, and helping
explain. And please always ask me follow up questions to ensure understanding!

---

### **💡 Why This is Important**
- **AI should assist, not replace thinking** → You should already have a plan before asking AI.  
- **AI works best with clear prompts** → This makes sure it generates useful, understandable code.  
- **This ensures AI-generated code works with our template** → Saves debugging time.  

Credit: this prompt was (of course!) refined with help from GPT-4o.