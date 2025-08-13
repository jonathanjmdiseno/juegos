const quizData = [
    {
        question: "¿Cuál es la sílaba tónica de 'café'?",
        type: "multiple-choice",
        options: ["ca-FE", "CA-fe", "ca-fe"],
        correctAnswer: "ca-FE",
        rule: "Aguda terminada en vocal. Las palabras agudas llevan tilde cuando terminan en vocal, n o s."
    },
    {
        question: "Escribe la palabra 'arbol' con la acentuación correcta.",
        type: "text-input",
        correctAnswer: "árbol",
        rule: "Llena terminada en consonante (no n, s). Las palabras llanas llevan tilde cuando NO terminan en vocal, n o s."
    },
    {
        question: "Elige la opción correcta: 'El' o 'Él' es un pronombre personal.",
        type: "multiple-choice",
        options: ["El", "Él"],
        correctAnswer: "Él",
        rule: "Tilde diacrítica: 'Él' es pronombre personal, 'El' es artículo."
    }
    // Se pueden añadir más preguntas cubriendo todas las reglas y excepciones de las Tablas 1 y 2
];