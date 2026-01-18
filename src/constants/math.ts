export const MATH_CATEGORIES = {
    Basic: [
      { label: 'Fraction', latex: '\frac{x}{y}', icon: '÷' },
      { label: 'Exponent', latex: 'x^{n}', icon: 'x²' },
      { label: 'Subscript', latex: 'x_{i}', icon: 'xₙ' },
      { label: 'Root', latex: '\sqrt{x}', icon: '√' },
    ],
    Algebra: [
      { label: 'Plus/Minus', latex: '\pm', icon: '±' },
      { label: 'Infinity', latex: '\infty', icon: '∞' },
      { label: 'Matrix', latex: '\begin{matrix} a & b \\ c & d \end{matrix}', icon: '⊞' },
      { label: 'Vector', latex: '\vec{v}', icon: '→' },
    ],
    Calculus: [
      { label: 'Sum', latex: '\sum_{i=1}^{n}', icon: '∑' },
      { label: 'Integral', latex: '\int_{a}^{b}', icon: '∫' },
      { label: 'Partial', latex: '\partial', icon: '∂' },
      { label: 'Product', latex: '\prod', icon: '∏' },
    ],
    Greek: [
      { label: 'Theta', latex: '\theta', icon: 'θ' },
      { label: 'Pi', latex: '\pi', icon: 'π' },
      { label: 'Delta', latex: '\Delta', icon: 'Δ' },
      { label: 'Omega', latex: '\omega', icon: 'ω' },
    ]
  };
  
  export const DIFFICULTY_OPTIONS = ['Easy', 'Medium', 'Hard'];
  export const OPTION_TYPES = ['Single Select', 'Multiple Select', 'Numerical', 'True/False'];

