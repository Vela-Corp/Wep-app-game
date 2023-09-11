import { SetStateAction, useState } from "react"
import { ICharacter } from "../interface/characters"

const Create = () => {
    const [characters, setCharacter] = useState({} as ICharacter)
    const [name, setName] = useState("")
    const handlClassChange = (e: { target: { value: SetStateAction<string> } }) => {
        if (e.target.value === "") {
            setCharacter({} as ICharacter)
            return
        }
        setCharacter(character[e.target.value])
    }
    const handlSubmit = (e: { preventDefault: () => void }) => {
        e.preventDefault()
        if (name === "") {
            alert("Bạn chưa nhập tên nhân vật")
            return
        }
        if (characters.name === undefined) {
            alert("Bạn chưa chọn lớp nhân vật")
            return
        }
        const dataFigure = {
            name: name,
            class: characters.name,
        }
        localStorage.setItem("dataFigure", JSON.stringify(dataFigure))

    }
    const character = {
        support: {
            name: "Hỗ trợ", // Tên nhân vật
            blood: 500, // Máu
            physics: 0, // Sát thương vật lý
            public: 0, // Sát thương phép
            physicalArmor: 0, // Giáp vật lý
            magicArmor: 0, // Giáp phép
            penetratesPhysicalArmor: 0, // Xuyên giáp vật lý
            magicPenetration: 0, // Xuyên giáp phép
            attackSpeed: 0, // Tốc độ đánh
            cooldown: 0, // Hồi chiêu
            runningSpeed: 0, // Tốc độ chạy
            intrinsic: 0, // Nội tại
        },
        assassin: {
            name: "Sát thủ",
            blood: 100,
            physics: 0,
            public: 0,
            physicalArmor: 0,
            magicArmor: 0,
            penetratesPhysicalArmor: 0,
            magicPenetration: 0,
            attackSpeed: 0,
            cooldown: 0,
            runningSpeed: 0,
            intrinsic: 0,
        },
        magician: {
            name: "Pháp sư",
            blood: 0,
            physics: 0,
            public: 0,
            physicalArmor: 0,
            magicArmor: 0,
            penetratesPhysicalArmor: 0,
            magicPenetration: 0,
            attackSpeed: 0,
            cooldown: 0,
            runningSpeed: 0,
            intrinsic: 0,
        },
        Archer: {
            name: "Xạ thủ",
            blood: 0,
            physics: 0,
            public: 0,
            physicalArmor: 0,
            magicArmor: 0,
            penetratesPhysicalArmor: 0,
            magicPenetration: 0,
            attackSpeed: 0,
            cooldown: 0,
            runningSpeed: 0,
            intrinsic: 0,
        },
        parry: {
            name: "Đỡ đòn",
            blood: 0,
            physics: 0,
            public: 0,
            physicalArmor: 0,
            magicArmor: 0,
            penetratesPhysicalArmor: 0,
            magicPenetration: 0,
            attackSpeed: 0,
            cooldown: 0,
            runningSpeed: 0,
            intrinsic: 0,
        },

    }


    return (
        <>
            <div className="box-background w-full">
                <div className="box-container w-full min-h-screen"
                    style={{
                        backgroundImage: "url(	https://www.ngocrongblue.online/images/2.jpg)",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                    }}
                >
                    <div className="content flex justify-center items-start w-2/3 mx-auto">
                        <div className="form-figure w-3/5 bg-white min-h-[600px] mt-20 bg-opacity-90 rounded-md">
                            <h1 className="text-center pt-2 text-red-600 text-2xl">Tạo nhân vật</h1>
                            <form>
                                <div className="box-form flex items-start gap-5 p-5">
                                    <div className="info">
                                        <div className="name-info w-60 mt-5">
                                            <label htmlFor="name" className="text-xl font-semibold" >Tên nhân vật</label> <br />
                                            <input type="text" id="name" className="outline-none border-2 border-blue-300 focus:border-blue-400 w-full h-8 pl-2 rounded-sm mt-2"
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                        </div>
                                        <div className="choose-class w-60 mt-5">
                                            <label htmlFor="class" className="text-xl font-semibold">Lớp</label> <br />
                                            <select onChange={handlClassChange} name="class" id="class" className="outline-none border-2  border-blue-300 focus:border-blue-400 w-full h-8 pl-2 rounded-sm mt-2">
                                                <option value="">Chọn hệ</option>
                                                <option value="support">Hỗ trợ</option>
                                                <option value="assassin">Sát Thủ</option>
                                                <option value="magician">Pháp sư</option>
                                                <option value="Archer">Xạ thủ</option>
                                                <option value="parry">Đỡ đòn</option>
                                            </select>
                                        </div>
                                        <div className="submit mt-20 text-center" >
                                            <button onClick={handlSubmit} className="bg-blue-500 w-36 px-5 py-2 text-white rounded-md">Tạo ngay</button>
                                        </div>
                                    </div>
                                    <div className="character w-full">
                                        <h3 className="text-center text-lg ">Chỉ số của nhân vật</h3>
                                        <div className="info-character mt-5">
                                            <div className="blood  ">
                                                <label htmlFor="blood" className="text-md font-normal">Máu : <span className="text-red-500 text-lg">{characters.blood}</span> </label> <br />
                                            </div>
                                            <div className="physics  ">
                                                <label htmlFor="physics" className="text-md font-normal">Sát thương vật lý :<span className="text-green-500 text-lg">{characters.physics}</span> </label> <br />
                                            </div>
                                            <div className="public  ">
                                                <label htmlFor="public" className="text-md font-normal">Sát thương phép :<span className="text-purple-600 text-lg">{characters.public}</span> </label> <br />
                                            </div>
                                            <div className="physical-armor  ">
                                                <label htmlFor="physical-armor" className="text-md font-normal">Giáp vật lý :{characters.physicalArmor} </label> <br />
                                            </div>
                                            <div className="magic-armor  ">
                                                <label htmlFor="magic-armor" className="text-md font-normal">Giáp phép :{characters.magicArmor} </label> <br />
                                            </div>
                                            <div className="penetrates-physical-armor  ">
                                                <label htmlFor="penetrates-physical-armor" className="text-md font-normal">Xuyên giáp vật lý :{characters.penetratesPhysicalArmor} </label> <br />
                                            </div>
                                            <div className="magic-penetration  ">
                                                <label htmlFor="magic-penetration" className="text-md font-normal">Xuyên giáp phép :{characters.magicPenetration} </label> <br />
                                            </div>
                                            <div className="attack-speed  ">
                                                <label htmlFor="attack-speed" className="text-md font-normal">Tốc độ đánh :{characters.attackSpeed} </label> <br />
                                            </div>
                                            <div className="cooldown  ">
                                                <label htmlFor="cooldown" className="text-md font-normal">Hồi chiêu :{characters.cooldown} </label> <br />
                                            </div>
                                            <div className="running-speed  ">
                                                <label htmlFor="running-speed" className="text-md font-normal">Tốc độ chạy :{characters.runningSpeed
                                                } </label> <br />
                                            </div>
                                            <div className="intrinsic  ">
                                                <label htmlFor="intrinsic" className="text-md font-normal">Nội tại :{characters.intrinsic} </label> <br />
                                            </div>

                                        </div>
                                    </div>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

export default Create