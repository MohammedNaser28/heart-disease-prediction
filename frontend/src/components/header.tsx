import '../App.css'
function Header() {
    // const pickModel = (_element: any) => {
    //     console.log("Model picked");
    // };

    // const toggleRadio = (_element: any, group: string) => {
    //     console.log("Radio toggled in group:", group);
    // };

    // const runPred = () => {
    //     console.log("Running prediction");
    // };
    return (
        <header>
            <div className="topbar">
                <div className="brand">
                    <div className="brand-dot"></div>
                    <div>
                        <div className="brand-name">CardioPredict</div>
                        <div className="brand-sub">heart disease prediction</div>
                    </div>
                </div>
                <div className="api-status">
                    <div className="api-dot"></div>
                    FastAPI · /predict
                </div>
            </div>
        </header>

    )
}
export default Header;