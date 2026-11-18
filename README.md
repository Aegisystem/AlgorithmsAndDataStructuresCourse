# Algoritmia y Estructuras de Datos Avanzadas

Este repositorio tiene el material de clase de la asignatura Algoritmia y Estructuras de Datos Avanzadas: diapositivas en HTML para las 16 semanas, en español, con ejemplos en Python 3 que se ejecutan con PyPy.

**Clases:** [algo.aegisystem.xyz](https://algo.aegisystem.xyz)

## Organización del curso

La asignatura dura 16 semanas, con dos sesiones de 1.5 h por semana. La sesión 1 (S1) es de teoría, con ejemplos resueltos en vivo. En la sesión 2 (S2), los estudiantes resuelven un contest corto en un juez en línea, con problemas de CSES, AtCoder y Codeforces. Los problemas que no se resuelven en clase pasan al taller semanal.

| Semana | S1 | S2 |
|---|---|---|
| 1 | Introducción y jueces | Práctica |
| 2 | Complejidad y simulación | Práctica |
| 3 | Strings | Práctica |
| 4 | Matrices | Contest 1 |
| 5 | Colecciones, pilas y colas | Práctica |
| 6 | Ordenamiento y búsqueda binaria | Práctica |
| 7 | Parcial teórico 1 | Contest 2 |
| 8 | Matemáticas y bits | Práctica |
| 9 | Sumas prefijas, diferencias y two pointers | Práctica |
| 10 | Greedy y colas de prioridad | Práctica |
| 11 | Recursión y búsqueda completa | Contest 3 |
| 12 | Grafos I | El docente resuelve (BFS) |
| 13 | Grafos II | Práctica |
| 14 | Programación dinámica | Práctica |
| 15 | Consultas de rango (Fenwick y sparse table) | Práctica |
| 16 | Parcial teórico 2 | Contest final |

Los contests valen el 55 % de la nota, los dos parciales teóricos el 25 % y los talleres, presentaciones, quices y actividades en clase el 20 %. Las notas se entregan en las semanas 7, 11 y 16.

El programa completo está en [PROGRAMA.md](PROGRAMA.md). Ahí están los problemas de cada semana, la ponderación por cortes y los temas que quedan fuera del curso.

## Python y PyPy

Todos los envíos, pruebas y mediciones del curso se hacen con PyPy 3. En Codeforces se elige la opción PyPy 3-64, y AtCoder y CSES también aceptan PyPy.

Los ejemplos de las clases ponen el código dentro de `main()`, leen con `input()` y escriben con `print()`:

```python
def main():
    n = int(input())
    a = list(map(int, input().split()))
    print(sum(a))

main()
```

La lectura y escritura rápidas (`sys.stdin.readline` y una sola escritura con `join`) se enseñan en la semana 4.

## Contenido del repositorio

| Ruta | Contenido |
|---|---|
| [PROGRAMA.md](PROGRAMA.md) | Programa oficial de la asignatura |
| [docs/](docs/) | Sitio de las clases, publicado con GitHub Pages desde la rama `main` |
| [docs/index.html](docs/index.html) | Índice de clases, agrupadas en cuatro módulos |
| [docs/config.js](docs/config.js) | Lista de clases y cuáles pueden abrir los estudiantes |
| [docs/assets/](docs/assets/) | `curso.css` y `curso.js`, compartidos por todas las clases |
| `docs/semana-NN-tema/` | Una carpeta por semana con `s1-teoria.html`. Las semanas 7 y 16 tienen `guia.html` para el parcial, y la semana 12 también tiene `s2-bfs.html` |

## Habilitar una clase

Cada clase tiene una entrada en [docs/config.js](docs/config.js) con el campo `disponible`. Una clase con `disponible: false` aparece en gris en el índice, y su enlace muestra un aviso en lugar de las diapositivas.

Para abrirla a los estudiantes:

1. En `docs/config.js`, cambiar `disponible: false` por `disponible: true` en esa clase.
2. Subir el cambio a `main`. GitHub Pages publica el sitio y el índice se actualiza solo.

Una clase nueva también se agrega en `docs/config.js`, con su semana, título, resumen, tipo de S2 y la ruta de su archivo en `url`.
