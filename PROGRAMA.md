# Algoritmia y Estructuras de Datos Avanzadas

Programa de asignatura (enfoque de programación competitiva en Python) · 16 semanas · 2 sesiones por semana de 1.5 h (3 h semanales, 48 h presenciales)

---

## 1. Información general

| Aspecto | Detalle |
|---|---|
| Duración | 16 semanas |
| Intensidad | 2 sesiones semanales de 1.5 h |
| Lenguaje principal | Python 3, ejecutado con PyPy |
| Prerrequisitos sugeridos | Programación II (idealmente Estructuras de Datos) |
| Trabajo autónomo esperado | 4–6 h semanales resolviendo los talleres |
| Plataforma del curso | Grupo en un juez en línea con problemas de CSES, AtCoder y Codeforces |

### Dinámica semanal

- **Sesión 1 (S1), teoría:** presentación del tema con ejemplos resueltos en vivo.
- **Sesión 2 (S2), práctica completa:** los estudiantes resuelven un contest corto en un juez en línea.
- **Semanas de solo teoría:** la S2 se usa para que el docente resuelva ejercicios en vivo, en los temas que más lo requieren. Cualquier S2 de práctica puede convertirse en una de estas si un tema no quedó claro.

### Formato de la S2 de práctica

- 4–6 problemas con dificultad escalonada: 2 fáciles, 2 medios y 1–2 de reto.
- El docente pasa por los puestos y resuelve dudas.
- En los últimos 10–15 minutos el docente explica el problema que menos estudiantes resolvieron.
- Los problemas no resueltos en clase pasan al taller semanal de trabajo autónomo.

---

## 2. Consideraciones por usar Python

- **Intérprete.** Todos los envíos, pruebas y mediciones del curso se hacen con PyPy 3. PyPy compila el código mientras corre y hace del orden de 10⁸ operaciones simples por segundo en bucles.
- **Diferencias de PyPy.** Concatenar strings con `+=` en un bucle cuesta O(n²): con 10⁶ concatenaciones tardó 11.7 s, frente a 0.015 s con `join` (PyPy 3.11, Apple M4). `sys.getsizeof` no funciona.
- **Jueces.** Codeforces (opción PyPy 3-64), AtCoder y CSES aceptan PyPy. vJudge permite armar listas con problemas de todos ellos.
- **Recursión.** El límite por defecto es de unas 1000 llamadas, y subirlo con `setrecursionlimit` no siempre basta. Se prioriza DFS iterativo y DP bottom-up.
- **No hay ordered set ni multiset estándar.** `sortedcontainers` no está en todos los jueces. Se reemplaza con `bisect`, heaps con borrado perezoso u otras técnicas.
- **Ventajas:** enteros de precisión arbitraria, `pow(a, b, m)`, `pow(a, -1, m)`, `itertools`, `collections` y una sintaxis corta, así que el código de cada algoritmo es corto.
- **Regla para el docente:** resolver en Python cada problema antes de asignarlo, para confirmar que el límite de tiempo permite pasarlo.
- **ICPC:** si algún estudiante quiere competir allí, en algún momento le hará falta C++. En la ICPC no siempre se garantiza que exista una solución en Python que pase los límites de tiempo.

### Plantilla base del curso

```python
import sys
input = sys.stdin.readline

def main():
    n = int(input())
    a = list(map(int, input().split()))
    ans = []
    # ...
    sys.stdout.write("\n".join(map(str, ans)) + "\n")

main()  # todo el código va dentro de main()
```

---

## 3. Cronograma general

| Sem | S1 (1.5 h) | S2 (1.5 h) |
|---|---|---|
| 1 | Introducción y jueces | Práctica |
| 2 | Complejidad y simulación | Práctica |
| 3 | Strings | Práctica |
| 4 | Matrices | **Contest 1** |
| 5 | Colecciones, pilas y colas | Práctica |
| 6 | Ordenamiento y búsqueda binaria | Práctica |
| 7 | **Parcial teórico 1** | **Contest 2** |
| 8 | Matemáticas y bits | Práctica |
| 9 | Sumas prefijas, diferencias y two pointers | Práctica |
| 10 | Greedy y colas de prioridad | Práctica |
| 11 | Recursión y búsqueda completa | **Contest 3** |
| 12 | Grafos I | Docente resuelve (BFS) |
| 13 | Grafos II | Práctica |
| 14 | Programación dinámica | Práctica |
| 15 | Consultas de rango (Fenwick y sparse table) | Práctica |
| 16 | **Parcial teórico 2** | **Contest final** |

**Total:** 14 sesiones de teoría, 10 de práctica, 1 en la que el docente resuelve, 4 contests y 2 parciales teóricos.

**Cortes de notas:** semanas 7, 11 y 16. Cada corte cierra con al menos un contest, de modo que siempre hay nota práctica presencial.

El orden va de temas livianos a pesados. Al inicio están I/O, simulación, strings, matrices y colecciones. Los temas más exigentes (grafos y DP) quedan en el último bloque.

---

## 4. Programa detallado

Los problemas son de CSES salvo que se indique otra cosa. **EDPC** es el AtCoder Educational DP Contest y **CF** es Codeforces.

### Bloque 1: Fundamentos (semanas 1–4)

#### Semana 1: Introducción y jueces
**Objetivo:** que el estudiante envíe soluciones correctas y sepa leer un enunciado.

**S1, teoría**
- Qué es la programación competitiva. Formatos ICPC, Codeforces y AtCoder: ranking y penalización por tiempo.
- Jueces en línea y veredictos: AC, WA, TLE, MLE, RE, CE. Uso del grupo del curso en el juez en línea.
- Partes de un enunciado: historia, entrada, salida, restricciones y ejemplos.
- Errores típicos de formato de salida: espacios sobrantes y saltos de línea.

**S2, práctica:** Weird Algorithm, Missing Number, Repetitions, Increasing Array; problemas A de AtCoder (PracticeA, ABC086 A *Product*, ABC081 A *Placing Marbles*).

#### Semana 2: Complejidad y simulación
**Objetivo:** estimar si una idea pasa el límite de tiempo antes de programarla.

**S1, teoría**
- Contar operaciones. O(1), O(log n), O(n), O(n log n), O(n²) y O(2ⁿ).
- Tabla de restricciones a complejidad aceptable:

  | Restricción | Complejidad aceptable |
  |---|---|
  | n ≤ 10 | O(n!) |
  | n ≤ 20 | O(2ⁿ) |
  | n ≤ 500 | O(n³) |
  | n ≤ 5000 | O(n²) |
  | n ≤ 2·10⁵ | O(n log n) |
  | n ≤ 10⁶ o más | O(n) u O(log n) |

  Con PyPy, los valores de n que pasan se acercan a los de C++, pero conviene dejar margen: con muchas listas pequeñas, tuplas o diccionarios PyPy es más lento.
- Costos ocultos en Python: `in` sobre una lista frente a un set, `pop(0)`, `insert(0, x)`, `list.index`, slicing y concatenación de strings.
- Medir tiempos con `time.perf_counter` y generar casos grandes para probar.
- Simulación: traducir el enunciado paso a paso y revisar casos borde (n = 1, entradas vacías, valores máximos).

**S2, práctica:** Permutations; problemas A de CF Div. 4 ([1742A *Sum*](https://codeforces.com/problemset/problem/1742/A), [1760A *Medium Number*](https://codeforces.com/problemset/problem/1760/A), [1791A *Codeforces Checking*](https://codeforces.com/problemset/problem/1791/A)) y B de ABC (ABC081 B *Shift only*, ABC087 B *Coins*, ABC083 B *Some Sums*, ABC088 B *Card Game for Two*).

#### Semana 3: Strings
**Objetivo:** manipular strings sin pasar el límite de tiempo.

**S1, teoría**
- Los strings son inmutables, así que se construyen con una lista y `join`.
- Indexación, slicing, `s[::-1]` y palíndromos.
- Métodos: `split`, `strip`, `count`, `find`, `replace`, `startswith`, `upper`/`lower`, `isdigit`.
- `ord`/`chr`, frecuencias con un arreglo de 26 posiciones o con `Counter`, y anagramas.
- Conversión entre números y strings: suma de dígitos y cambios de base (`bin`, `int(s, 2)`).
- Comparación lexicográfica.

**S2, práctica:** [CF 71A *Way Too Long Words*](https://codeforces.com/problemset/problem/71/A), [CF 118A *String Task*](https://codeforces.com/problemset/problem/118/A), [CF 112A *Petya and Strings*](https://codeforces.com/problemset/problem/112/A), [CF 236A *Boy or Girl*](https://codeforces.com/problemset/problem/236/A), CSES Palindrome Reorder.

#### Semana 4: Matrices + Contest 1
**Objetivo:** trabajar con listas 2D y grillas, que se usan otra vez en prefijas 2D y en grafos.

**S1, teoría**
- Cómo crear una matriz: `[[0]*m for _ in range(n)]`, y por qué `[[0]*m]*n` falla (todas las filas son la misma lista).
- Leer matrices de números y grillas de caracteres (`#` y `.`).
- Recorridos: por filas, por columnas, diagonal principal y secundaria, y en espiral.
- Transpuesta con `zip(*M)`, rotación de 90° con `zip(*M[::-1])` y reflejos.
- Vecinos con `dx, dy` (4 y 8 direcciones) y verificación de límites.
- Multiplicación de matrices en O(n³). La exponenciación de matrices solo se menciona.
- Aplanar la matriz (índice `i*m + j`) para guardar cada celda como un entero.
- Entrada y salida rápida: leer con `sys.stdin.readline` y escribir una sola vez con `join`, con Number Spiral (10⁵ consultas) como caso.

**S2: Contest 1** (semanas 1–4).

**Tarea de matrices:** [CF 263A *Beautiful Matrix*](https://codeforces.com/problemset/problem/263/A), CSES Number Spiral, ABC075 B *Minesweeper* y ABC107 B *Grid Compression*.

---

### Bloque 2: Herramientas básicas (semanas 5–8)

#### Semana 5: Colecciones, pilas y colas
**Objetivo:** elegir la estructura de datos según la operación que domina el problema.

**S1, teoría**
- `set`: pertenencia en O(1), operaciones de conjuntos y eliminación de duplicados.
- `dict`: contar, agrupar y mapear. `Counter` y `defaultdict(list)`.
- Pila con `list`: paréntesis balanceados, evaluación de expresiones y operación de deshacer.
- Cola con `deque`: simulación de filas y `rotate`.
- Tabla comparativa de complejidades por estructura.

**S2, práctica:** Distinct Numbers, Josephus Problem I, [CF 4C *Registration System*](https://codeforces.com/problemset/problem/4/C), [CF 26B *Regular Bracket Sequence*](https://codeforces.com/problemset/problem/26/B).

#### Semana 6: Ordenamiento y búsqueda binaria
**Objetivo:** usar el orden de los datos para resolver más rápido.

**S1, teoría**
- `sort` vs `sorted`, `reverse` y `key` con `lambda`. Varios criterios con tuplas, usando `-x` para orden descendente.
- Ordenar índices por valor y estabilidad del ordenamiento.
- Ordenar como paso previo para emparejar elementos.
- Búsqueda binaria manual: invariante `lo`/`hi` y cómo evitar errores off-by-one.
- `bisect_left`/`bisect_right`: primera posición ≥ x y conteo en un rango [a, b].
- Introducción a la búsqueda binaria sobre la respuesta (predicado monótono) con un ejemplo.

**S2, práctica:** Ferris Wheel, Apartments, Restaurant Customers, Factory Machines, [CF 706B *Interesting Drink*](https://codeforces.com/problemset/problem/706/B).

#### Semana 7: Evaluación (corte 1)
- **S1: Parcial teórico 1** (semanas 1–6).
- **S2: Contest 2** (semanas 1–6, con énfasis en 5–6).

#### Semana 8: Matemáticas y bits
**Objetivo:** usar las herramientas de matemáticas y de bits que más aparecen en los problemas.

**S1, teoría**
- Divisibilidad, `%` con negativos en Python, `math.gcd` y `math.lcm`.
- Primalidad y divisores hasta √n. Criba de Eratóstenes con `bytearray`.
- Fórmulas de sumas (Gauss) y conteo simple.
- Aritmética modular (10⁹+7): suma, resta y producto módulo m, y `pow(a, b, m)`.
- Bits: `&`, `|`, `^`, `~`, `<<` y `>>`. Consultar, encender y apagar un bit. `bin()`, `int.bit_count()`, potencias de 2 y propiedades del XOR.

**S2, práctica:** [CF 1A *Theatre Square*](https://codeforces.com/problemset/problem/1/A), Trailing Zeros, Coin Piles, Bit Strings, Exponentiation, y Two Knights como reto.

---

### Bloque 3: Técnicas (semanas 9–11)

#### Semana 9: Sumas prefijas, diferencias y two pointers
**Objetivo:** responder consultas sobre rangos sin recorrer el arreglo cada vez.

**S1, teoría**
- Prefijas 1D con `itertools.accumulate` y consultas de rango en O(1).
- Prefijas 2D (retoma matrices) con inclusión-exclusión.
- Arreglo de diferencias para actualizaciones de rango.
- Prefijas combinadas con un dict para contar subarreglos con suma k.
- Two pointers sobre un arreglo ordenado. Ventana deslizante de tamaño fijo y de tamaño variable.

**S2, práctica:** Static Range Sum Queries, Forest Queries, Sum of Two Values, Subarray Sums I, Subarray Sums II, y Playlist como reto.

#### Semana 10: Greedy y colas de prioridad
**Objetivo:** reconocer cuándo una decisión local lleva al óptimo global.

**S1, teoría**
- Qué es un algoritmo greedy y por qué buscar contraejemplos antes de programar.
- Ordenar y luego elegir: intervalos ordenados por su fin, y la mediana como óptimo.
- Kadane para el subarreglo de suma máxima.
- `heapq`: `heappush`, `heappop`, `heapify`, max-heap con negativos y tuplas como prioridad.
- Greedy con heap: asignación de recursos y los k mayores.

**S2, práctica:** Movie Festival, Stick Lengths, Maximum Subarray Sum, Tasks and Deadlines, y Room Allocation como reto.

#### Semana 11: Recursión y búsqueda completa + Contest 3
**Objetivo:** explorar todas las opciones cuando n es pequeño.

**S1, teoría**
- Recursión: caso base, pila de llamadas y `sys.setrecursionlimit`. Cuándo evitarla en Python.
- Todos los subconjuntos, con bitmask (`range(1 << n)`) y de forma recursiva.
- `itertools.permutations`, `combinations` y `product`.
- Backtracking con poda: N reinas y generación de cadenas válidas.
- Estimar si la búsqueda completa cabe en el tiempo (2²⁰ ≈ 10⁶, 8! = 40 320).

**S2: Contest 3** (semanas 8–10, acumulativo). Cierra el corte 2.

**Tarea de búsqueda completa:** Apple Division, Creating Strings, Tower of Hanoi, Gray Code, y Chessboard and Queens como reto.

---

### Bloque 4: Temas avanzados (semanas 12–16)

#### Semana 12: Grafos I (solo teoría)
**S1, teoría**
- Vocabulario: nodo, arista, grafo dirigido o no, ponderado, grado, camino, ciclo y árbol.
- Representaciones: lista de adyacencia, matriz y lista de aristas, y cómo leerlas en Python.
- DFS iterativo con pila, arreglo de visitados y componentes conexas.
- Grillas como grafos implícitos (retoma matrices) y flood fill.

**S2, el docente resuelve**
- BFS con `collections.deque`: distancias mínimas sin pesos y reconstrucción del camino con un arreglo de padres.
- Variantes de BFS: multifuente y bipartición (2-coloreo).
- En vivo: Counting Rooms, Building Roads, Message Route, Labyrinth.

**Tarea de grafos:** Building Teams.

#### Semana 13: Grafos II
**S1, teoría**
- Dijkstra con `heapq` y borrado perezoso (saltar el nodo si `d > dist[u]`).
- Orden topológico (Kahn) y detección de ciclos en grafos dirigidos.
- Union-Find con compresión de caminos y unión por tamaño, implementado de forma iterativa.
- Árbol de expansión mínima con Kruskal: ordenar las aristas y unir con Union-Find (retoma ordenamiento y greedy).

**S2, práctica (Grafos I y II):** Shortest Routes I, Course Schedule, Road Construction, Road Reparation, y Round Trip como reto.

> **Nota:** Shortest Routes II necesita Floyd-Warshall, que está fuera del programa. El tiempo no es el problema: con n = 500 hace 1.25·10⁸ operaciones y con PyPy tardó 0.26 s (PyPy 3.11, Apple M4).

#### Semana 14: Programación dinámica
**S1, teoría**
- De la recursión con subproblemas repetidos a la memoización (`functools.cache`), y de ahí a la tabla.
- Las cinco piezas de una DP: estado, transición, caso base, orden de cálculo y respuesta.
- DP 1D: Frog 1, Dice Combinations y monedas (mínimo número de monedas frente a número de formas de pagar).
- DP 2D: contar caminos en grillas con obstáculos.
- Mochila 0/1, y su versión en 1D recorriendo al revés.
- Por qué en Python conviene bottom-up: límite de recursión y costo de las llamadas.
- Cómo reconocer que un problema es de DP.

**S2, práctica:** [EDPC Frog 1](https://atcoder.jp/contests/dp/tasks/dp_a), Dice Combinations, Minimizing Coins, Grid Paths, [EDPC Knapsack 1](https://atcoder.jp/contests/dp/tasks/dp_d); como retos, Coin Combinations II y [EDPC LCS](https://atcoder.jp/contests/dp/tasks/dp_f).

**Tarea de DP:** Removing Digits, Coin Combinations I, [EDPC Frog 2](https://atcoder.jp/contests/dp/tasks/dp_b), [EDPC Vacation](https://atcoder.jp/contests/dp/tasks/dp_c), y Array Description como reto.

> **Nota:** CSES Book Shop hace del orden de 10⁸ operaciones y Edit Distance del orden de 2.5·10⁷. Con PyPy tardaron 0.20 s y 0.22 s con las entradas máximas (PyPy 3.11, Apple M4), así que se pueden usar como retos.

#### Semana 15: Consultas de rango con Fenwick y sparse table
**Objetivo:** responder consultas sobre rangos cuando el arreglo cambia o cuando la operación no admite restas.

**S1, teoría**
- Repaso de sumas prefijas (semana 9) y por qué dejan de servir si el arreglo cambia.
- Árbol de Fenwick: la idea de `i & -i`, actualización de un elemento y suma de prefijo en O(log n), y construcción en O(n).
- Actualización de rango y consulta puntual con un arreglo de diferencias sobre Fenwick (retoma la semana 9).
- Sparse table: tabla por potencias de 2, construcción en O(n log n) y mínimo de un rango en O(1) para arreglos que no cambian. En Python, cada fila se construye con `map(min, ...)` y el tamaño del bloque sale de `bit_length()`.
- Cuándo usar sumas prefijas, Fenwick o sparse table.

**S2, práctica:** Dynamic Range Sum Queries, Static Range Minimum Queries, Range Update Queries, [ACL Practice B *Fenwick Tree*](https://atcoder.jp/contests/practice2/tasks/practice2_b), y List Removals como reto.

> **Nota:** Dynamic Range Minimum Queries necesita segment tree, que está fuera del programa.

#### Semana 16: Evaluación final (corte 3)
- **S1: Parcial teórico 2** (semanas 8–15).
- **S2: Contest final** (todo el curso, con énfasis en las semanas 11–15). Si la institución tiene una franja de examen más larga, conviene usarla.

---

## 5. Evaluación

### Contests

90 minutos, en un juez en línea, con 4–6 problemas escalonados.

| Contest | Semana | Cubre |
|---|---|---|
| Contest 1 | 4 | Semanas 1–4 |
| Contest 2 | 7 | Semanas 1–6, con énfasis en 5–6 |
| Contest 3 | 11 | Semanas 8–10, acumulativo |
| Contest final | 16 | Todo, con énfasis en 11–15 |

### Parciales teóricos

Escritos, sin computador. Tipos de ítem sugeridos:
- Calcular la complejidad de fragmentos de código.
- Hacer la traza de un algoritmo a mano: búsqueda binaria, BFS, llenado de una tabla de DP.
- Leer un enunciado e identificar la técnica, justificando la elección.
- Escribir a mano la solución en pseudocódigo o Python.
- Encontrar el error en un código dado o dar un contraejemplo para un greedy.

| Parcial | Semana | Cubre |
|---|---|---|
| Parcial teórico 1 | 7 | Semanas 1–6 |
| Parcial teórico 2 | 16 | Semanas 8–15 |

### Ponderación por cortes

Las notas se entregan en las semanas 7, 11 y 16. Los cortes pesan 25 % / 20 % / 35 %, y los talleres, presentaciones, quices y actividades en clase son una nota global del 20 % para todo el curso, sin dividir por corte.

| Corte | Componente | Semana | Peso |
|---|---|---|---|
| 1 (sem. 1–7) | Contest 1 | 4 | 5 % |
| | Parcial teórico 1 | 7 | 10 % |
| | Contest 2 | 7 | 10 % |
| 2 (sem. 8–11) | Contest 3 | 11 | 20 % |
| 3 (sem. 12–16) | Parcial teórico 2 | 16 | 15 % |
| | Contest final | 16 | 20 % |
| Global (todo el curso) | Talleres, presentaciones, quices y actividades en clase (sem. 1–15) | 1–15 | 20 % |
| | **Total** | | **100 %** |

Por componente: contests 55 %, parciales 25 % y talleres, presentaciones, quices y actividades en clase 20 %. El Contest 1 pesa poco porque es el primero del curso y sirve para conocer el formato.

**Talleres, presentaciones, quices y actividades en clase:** el taller es la lista semanal de problemas en un juez en línea para el trabajo autónomo. En las presentaciones, algunos estudiantes explican en clase la solución de un problema del taller. Los quices son preguntas cortas sobre los temas vistos. Las actividades en clase son los ejercicios que se proponen durante las sesiones. Todo esto contribuye a la misma nota global del 20 %.

Las semanas 7 y 16 concentran dos evaluaciones. Si la carga es excesiva, el parcial teórico puede ir en la S1 de la semana anterior, siempre que quede dentro del mismo corte.

### Integridad académica

Los modelos de IA resuelven la mayoría de los problemas fáciles e intermedios. Por eso:
- Los contests y los parciales son presenciales y pesan más que los talleres hechos en casa.
- Las presentaciones funcionan como defensa oral: el docente elige al azar quién explica una solución del taller.

---

## 6. Temas fuera del programa

### Extensiones si el grupo va adelantado

Se pueden usar como reto o bonificación:
- Combinatoria modular: inverso con `pow(a, -1, m)`, factoriales y nCr.
- Exponenciación de matrices, que conecta las semanas 4 y 8.

### Temas excluidos y motivo

| Tema | Motivo |
|---|---|
| Meet in the middle, DP con bitmask | Son lentos en Python con los límites habituales |
| DP de intervalos, LIS en O(n log n) | Alargan demasiado el bloque de DP |
| Bellman-Ford, Floyd-Warshall, 0-1 BFS | Dijkstra cubre lo esencial y no hay espacio en el semestre |
| Binary lifting y LCA | No caben en el semestre |
| Segment tree | Sin espacio en el semestre |
| KMP y hashing de strings | `str.find` cubre la búsqueda simple |
| Compresión de coordenadas, `cmp_to_key` | Quedan como retos sueltos |

---

## 7. Recursos

- [CSES Problem Set](https://cses.fi/problemset/): fuente principal de problemas.
- [AtCoder Educational DP Contest](https://atcoder.jp/contests/dp): bloque de programación dinámica.
- [AtCoder Beginner Contests](https://atcoder.jp/contests/): problemas A/B/C para principiantes.
- [Codeforces](https://codeforces.com/): problemas por etiqueta y rating, y rondas Div. 4.
- [vJudge](https://vjudge.net/): armado de listas y contests del curso.
- [USACO Guide](https://usaco.guide/): muchos módulos traen código en Python.
- PyRival (GitHub): implementaciones en Python. Es material de consulta para el docente y los estudiantes no deben copiar su código.
- *Competitive Programmer's Handbook*, Antti Laaksonen: teoría general. Los ejemplos están en C++ y la teoría sirve para cualquier lenguaje.
