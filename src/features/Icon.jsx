import * as Icons from "phosphor-react"

const Icon = ({ icon, ...props }) => {
    const Icon = Icons[icon]
    return <Icon {...props} weight="bold" />
}

export default Icon;