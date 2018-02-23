import React = require('react')

const loader = (props: {size: number, background: string, hint: string} = {size: 32, background: 'white', hint: 'Loading...'}) => {
    return (
        <div style={{
            display: 'inline-block',
            width: props.size,
            height: props.size,
            overflow: 'hidden',
            animation: 'rotation infinite 1s',
            filter: 'opacity(.8)',
            cursor: 'default',
            userSelect: 'none',
        }}
        title={props.hint}>
            <div style={{
                position: 'absolute',
                background: 'linear-gradient(to right, #099dcb 0%,#207cca 0%,#099dcb 0%,#38cc73 100%)',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
            }}> &nbsp; </div>
            <div style={{
                position: 'absolute',
                background: props.background,
                transform: 'scale(0.85)',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                boxShadow: `inset 0px 0px ${props.size / 10}px black`,
            }}> &nbsp; </div>

            <div style={{
                background: props.background,
                width: props.size / 2,
                height: props.size,
                top: 0,
                left: props.size / 2,
                position: 'absolute',
            }}> &nbsp; </div>

        </div>
    )

}
export default loader
