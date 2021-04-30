import { FirstFitSolver } from "./naive-solver";
import { ISolver } from "./solver-base";

export class SolverFactory {
    static loadSolver(className: string): ISolver {
        switch (className) {
            case (FirstFitSolver.name): return new FirstFitSolver();
            // add more cases when implemented more solvers
            default: return new FirstFitSolver()
        }
    }
}