# Guía de trabajo del equipo

## 1. Ramas

Nadie trabaja directo en `main`. Cada tarea va en su propia rama:

- `feature/nombre-tarea` → algo nuevo. Ej.: `feature/hilda-carta`
- `fix/nombre-error` → corrección. Ej.: `fix/total-carrito`

```bash
git checkout main
git pull
git checkout -b feature/hilda-carta
```

## 2. Commits

Formato: `tipo(alcance): descripción corta`, con verbo en infinitivo.

| Tipo | Cuándo usarlo | Ejemplo |
|---|---|---|
| `feat` | Funcionalidad nueva | `feat(carta): mostrar productos por categoría` |
| `fix` | Corregir un error | `fix(carrito): el total no restaba la promo 2x1` |
| `refactor` | Reorganizar código sin cambiar lo que hace | `refactor(pago): separar el cálculo del vuelto` |
| `style` | Formato del código (espacios, orden). **No es para CSS** | `style: ordenar imports` |
| `docs` | Documentación | `docs: agregar rutas al README` |
| `test` | Pruebas | `test(pedido): probar el cálculo del total` |
| `chore` | Mantenimiento (dependencias, configuración) | `chore: actualizar dependencias` |
| `build` / `ci` | Compilación / GitHub Actions | `build: actualizar Vite` |
| `perf` | Rendimiento | `perf(carta): cargar imágenes de forma diferida` |
| `revert` | Deshacer un commit | `revert: feat(carta): ...` |

Si el cambio rompe algo que usan los demás (por ejemplo, un tipo de `shared/`), agrega `!`:
`feat(shared)!: renombrar precio a precioUnitario`

Un commit por cambio. No juntar varias cosas en uno solo.

## 3. Pull request (PR)

1. Sube tu rama: `git push -u origin feature/hilda-carta`
2. En GitHub, haz clic en **Compare & pull request**.
3. Llena la plantilla (qué hiciste, pantalla del Figma, captura, checklist).
4. Elige un **reviewer**.
5. Si te piden cambios, corrige en **la misma rama** y vuelve a hacer push (el PR se actualiza solo).
6. Con la aprobación: **Merge pull request** y luego **Delete branch**.

### Después de cada merge, los demás actualizan su rama

```bash
git checkout main
git pull
git checkout feature/mi-rama
git merge main
```

## 4. Reglas

- Nadie hace push directo a `main`; todo entra por PR con al menos 1 aprobación.
- PRs pequeños: una pantalla o una funcionalidad por PR.
- Si el PR toca `shared/`, lo revisan todos.
- Revisar los PR en menos de un día.
- Antes de abrir el PR, verificar que compile.
