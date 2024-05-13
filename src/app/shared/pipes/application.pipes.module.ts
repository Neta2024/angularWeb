import { NgModule } from "@angular/core";
import { ThaiDatePipe } from "./thaidate.pipe";

@NgModule({
    imports: [
        // dep modules
    ],
    declarations: [
        ThaiDatePipe
    ],
    exports: [
        ThaiDatePipe
    ]
})
export class ApplicationPipesModule { }