import { useRive, useStateMachineInput } from '@rive-app/react-canvas-lite';
import { useEffect } from 'react';

const COLOR = {
    BLUE: 7,
};

/**
 * Odin Orb Component
 * @param {Object} props
 * @param {'idle' | 'listening' | 'thinking' | 'speaking' | 'asleep'} props.status - Current status of the orb
 * @param {'BLACK' | 'WHITE' | 'RED' | 'ORANGE' | 'YELLOW' | 'GREEN' | 'CYAN' | 'BLUE' | 'PURPLE' | 'PINK'} props.color - Color of the orb
 * @param {string} props.className - Additional CSS classes
 * @param {Function} props.onLoad - Callback when orb loads
 */
export const Odin = ({
                         status = 'idle',
                         color = 'WHITE',
                         className = '',
                         onLoad,
                     }) => {
    const stateMachine = 'default';

    // Calculate state values based on status
    const isListening = status === 'listening';
    const isThinking = status === 'thinking';
    const isSpeaking = status === 'speaking';
    const isAsleep = status === 'asleep';

    // Initialize Orb Rive component
    const { rive, RiveComponent } = useRive({
        src: '/orb-1.0.0.riv',
        stateMachines: stateMachine,
        autoplay: true,
        onLoad,
    });

    // Orb inputs
    const listeningInput = useStateMachineInput(rive, stateMachine, 'listening');
    const thinkingInput = useStateMachineInput(rive, stateMachine, 'thinking');
    const speakingInput = useStateMachineInput(rive, stateMachine, 'speaking');
    const asleepInput = useStateMachineInput(rive, stateMachine, 'asleep');
    const colorInput = useStateMachineInput(rive, stateMachine, 'color');

    // Update inputs when props change
    useEffect(() => {
        if (listeningInput) {
            listeningInput.value = isListening;
        }
        if (thinkingInput) {
            thinkingInput.value = isThinking;
        }
        if (speakingInput) {
            speakingInput.value = isSpeaking;
        }
        if (asleepInput) {
            asleepInput.value = isAsleep;
        }
        if (colorInput) {
            colorInput.value = COLOR[color] ?? COLOR.WHITE;
        }
    }, [
        isListening,
        isThinking,
        isSpeaking,
        isAsleep,
        color,
        listeningInput,
        thinkingInput,
        speakingInput,
        asleepInput,
        colorInput,
    ]);

    return <RiveComponent className={className} />;
};