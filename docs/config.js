// Clases que los estudiantes pueden abrir.
//
// Para habilitar una clase: cambie `disponible: false` por `disponible: true`
// en esa clase, guarde y suba el cambio. El índice y la clase se actualizan solos.
//
// Una clase deshabilitada aparece en gris en el índice y, si alguien abre su
// enlace, ve un aviso en lugar de las diapositivas. Para verla igual (por ejemplo,
// para prepararla o proyectarla), agregue ?docente al final de la dirección:
//   https://algo.aegisystem.xyz/?docente
//   https://algo.aegisystem.xyz/semana-02-complejidad/s1-teoria.html?docente
//
// `url: null` significa que la clase todavía no tiene material.

window.CURSO = {
  modulos: [
    {
      nombre: "Módulo 1 · Fundamentos",
      semanas: "semanas 1–4",
      clases: [
        { semana: 1, titulo: "Introducción y jueces", resumen: "Formatos de competencia, veredictos, enunciados, entrada y salida", s2: "práctica", url: "semana-01-introduccion/s1-teoria.html", disponible: true },
        { semana: 2, titulo: "Complejidad y simulación", resumen: "Contar operaciones, tabla de restricciones, costos ocultos, Permutations", s2: "práctica", url: "semana-02-complejidad/s1-teoria.html", disponible: false },
        { semana: 3, titulo: "Strings", resumen: "Slicing, join, métodos, frecuencias, bases, orden lexicográfico", s2: "práctica", url: "semana-03-strings/s1-teoria.html", disponible: false },
        { semana: 4, titulo: "Matrices", resumen: "Crear y leer, recorridos, vecinos, Number Spiral, entrada y salida rápida", s2: "Contest 1", url: "semana-04-matrices/s1-teoria.html", disponible: false }
      ]
    },
    {
      nombre: "Módulo 2 · Herramientas básicas",
      semanas: "semanas 5–8",
      clases: [
        { semana: 5, titulo: "Colecciones, pilas y colas", resumen: "set, dict, Counter, pilas con list, colas con deque", s2: "práctica", url: null, disponible: false },
        { semana: 6, titulo: "Ordenamiento y búsqueda binaria", resumen: "sort con key, bisect, búsqueda binaria sobre la respuesta", s2: "práctica", url: null, disponible: false },
        { semana: 7, titulo: "Parcial teórico 1", resumen: "Semanas 1 a 6", s2: "Contest 2", url: null, disponible: false },
        { semana: 8, titulo: "Matemáticas y bits", resumen: "Divisibilidad, criba, aritmética modular, operaciones con bits", s2: "práctica", url: null, disponible: false }
      ]
    },
    {
      nombre: "Módulo 3 · Técnicas",
      semanas: "semanas 9–11",
      clases: [
        { semana: 9, titulo: "Sumas prefijas, diferencias y two pointers", resumen: "Prefijas 1D y 2D, arreglo de diferencias, ventana deslizante", s2: "práctica", url: null, disponible: false },
        { semana: 10, titulo: "Greedy y colas de prioridad", resumen: "Intervalos, Kadane, heapq", s2: "práctica", url: null, disponible: false },
        { semana: 11, titulo: "Recursión y búsqueda completa", resumen: "Subconjuntos con bitmask, itertools, backtracking con poda", s2: "Contest 3", url: null, disponible: false }
      ]
    },
    {
      nombre: "Módulo 4 · Temas avanzados",
      semanas: "semanas 12–16",
      clases: [
        { semana: 12, titulo: "Grafos I", resumen: "Representaciones, DFS iterativo, grillas como grafos, BFS", s2: "el docente resuelve", url: null, disponible: false },
        { semana: 13, titulo: "Grafos II", resumen: "Dijkstra, orden topológico, Union-Find, Kruskal", s2: "práctica", url: null, disponible: false },
        { semana: 14, titulo: "Programación dinámica", resumen: "Memoización, DP 1D y 2D, mochila 0/1", s2: "práctica", url: null, disponible: false },
        { semana: 15, titulo: "Consultas de rango", resumen: "Árbol de Fenwick y sparse table", s2: "práctica", url: null, disponible: false },
        { semana: 16, titulo: "Parcial teórico 2", resumen: "Semanas 8 a 15", s2: "Contest final", url: null, disponible: false }
      ]
    }
  ]
};
